from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from routes.upload_pod_route import upload_pod_route
from routes.get_pods_route import get_pods_route

# Load environment variables
load_dotenv('.env.local')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Register routes
upload_pod_route(app)
get_pods_route(app)


if __name__ == '__main__':
    app.run(debug=True)
