from flask import request, jsonify
import uuid
import datetime
from services.aws import s3_client, S3_BUCKET_NAME
from services.supabase_client import supabase

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg',
                      'gif', 'pdf', 'txt', 'docx', 'wav', 'mp3', 'webp'}
MAX_CONTENT_LENGTH = 2 * 1024 * 1024 * 1024  # 2 GB limit


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def sanitize_filename(title, filename):
    extension = filename.rsplit('.', 1)[1].lower()
    sanitized_title = title.replace(' ', '_').lower()
    unique_filename = f"{sanitized_title}_{uuid.uuid4().hex}.{extension}"
    return unique_filename


def upload_pod_route(app):
    @app.route('/upload_pod', methods=['POST'])
    def upload_pod():
        files = request.files.getlist('files')
        image = request.files.get('image')
        title = request.form.get('title')
        summary = request.form.get('summary')

        if not files:
            return jsonify({'error': 'No files provided'}), 400
        if not title:
            return jsonify({'error': 'No title provided'}), 400
        if not summary:
            return jsonify({'error': 'No summary provided'}), 400
        if not image or not allowed_file(image.filename):
            return jsonify({'error': 'Invalid or no image provided'}), 400

        uploaded_files_info = []
        for file in files:
            if file.filename == '':
                continue  # Skip files with no filename
            if allowed_file(file.filename):
                unique_filename = str(uuid.uuid4())
                date_prefix = datetime.datetime.now().strftime('%Y%m%d%H%M%S%f')
                s3_key = f"{date_prefix}_{unique_filename}"
                try:
                    s3_client.upload_fileobj(
                        file,
                        S3_BUCKET_NAME,
                        s3_key,
                        ExtraArgs={'ACL': 'private'}
                    )
                    # Generate the S3 file URL
                    file_url = s3_client.generate_presigned_url(
                        'get_object',
                        Params={'Bucket': S3_BUCKET_NAME, 'Key': s3_key},
                        ExpiresIn=604800  # 7 days (in seconds)
                    )
                    uploaded_files_info.append(
                        {'filename': file.filename, 'url': file_url})
                except Exception as e:
                    print(e)
                    return jsonify({'error': 'Error uploading file'}), 500
            else:
                return jsonify({'error': f'File type not allowed: {file.filename}'}), 400

        # Upload image
        sanitized_image_filename = sanitize_filename(title, image.filename)
        image_s3_key = f"{datetime.datetime.now().strftime('%Y%m%d%H%M%S%f')}_{
            sanitized_image_filename}"
        try:
            s3_client.upload_fileobj(
                image,
                S3_BUCKET_NAME,
                image_s3_key,
                ExtraArgs={'ACL': 'private'}
            )
            image_url = s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': S3_BUCKET_NAME, 'Key': image_s3_key},
            )
        except Exception as e:
            print(e)
            return jsonify({'error': 'Error uploading image'}), 500

        if uploaded_files_info:
            # Create a new entry in Supabase
            try:
                response = supabase.table('pods').insert({
                    'title': title,
                    'summary': summary,
                    'media_url': uploaded_files_info[0]['url'],
                    'image_url': image_url
                }).execute()

            except Exception as e:
                print(e)
                return jsonify({'error': 'Error creating database entry'}), 500

            return jsonify({
                'title': title,
                'summary': summary,
                'files': uploaded_files_info,
                'image_url': image_url
            }), 200
        else:
            return jsonify({'error': 'No files uploaded'}), 400
