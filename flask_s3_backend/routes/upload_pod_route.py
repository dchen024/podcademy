from flask import request, jsonify
import uuid
import datetime
from services.aws import s3_client, S3_BUCKET_NAME
from services.supabase_client import supabase

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg',
                      'gif', 'pdf', 'txt', 'docx', 'wav', 'mp3'}
MAX_CONTENT_LENGTH = 2 * 1024 * 1024 * 1024  # 2 GB limit


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_pod_route(app):
    @app.route('/upload_pod', methods=['POST'])
    def upload_pod():
        files = request.files.getlist('files')
        title = request.form.get('title')
        summary = request.form.get('summary')

        if not files:
            return jsonify({'error': 'No files provided'}), 400
        if not title:
            return jsonify({'error': 'No title provided'}), 400
        if not summary:
            return jsonify({'error': 'No summary provided'}), 400

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
                    )
                    uploaded_files_info.append(
                        {'filename': file.filename, 'url': file_url})
                except Exception as e:
                    print(e)
                    return jsonify({'error': 'Error uploading file'}), 500
            else:
                return jsonify({'error': f'File type not allowed: {file.filename}'}), 400

        if uploaded_files_info:
            # Create a new entry in Supabase
            try:
                response = supabase.table('pods').insert({
                    'title': title,
                    'summary': summary,
                    'media_url': uploaded_files_info[0]['url']
                }).execute()

            except Exception as e:
                print(e)
                return jsonify({'error': 'Error creating database entry'}), 500

            return jsonify({
                'title': title,
                'summary': summary,
                'files': uploaded_files_info
            }), 200
        else:
            return jsonify({'error': 'No files uploaded'}), 400
