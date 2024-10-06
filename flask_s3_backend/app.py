from flask import Flask, request, jsonify
import boto3
import os
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import uuid
import datetime
from flask_cors import CORS

# Load environment variables
load_dotenv('.env.local')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# AWS Credentials and S3 Bucket Name
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION')
S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')

print(AWS_REGION)

# Configure boto3 client
s3_client = boto3.client(
    's3',
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf',
                      'txt', 'zip', 'docx'}  # edit this to include mp4 mp3 etc
MAX_CONTENT_LENGTH = 2 * 1024 * 1024 * 1024  # 2 GB limit

app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['POST'])
def upload():
    files = request.files.getlist('files')
    if not files:
        return jsonify({'error': 'No files provided'}), 400

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
        return jsonify({'files': uploaded_files_info}), 200
    else:
        return jsonify({'error': 'No files uploaded'}), 400


if __name__ == '__main__':
    app.run(debug=True)
