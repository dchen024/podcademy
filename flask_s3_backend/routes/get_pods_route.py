from flask import jsonify, request
from services.supabase_client import supabase


def get_pods_route(app):
    @app.route('/pods', methods=['GET'])
    def get_pods():
        try:
            response = supabase.table('pods').select('*').execute()
            return jsonify(response.data), 200
        except Exception as e:
            print(e)
            return jsonify({'error': 'Error fetching data'}), 500

    @app.route('/pods/<id>', methods=['GET'])
    def get_pod_by_id(id):
        try:
            response = supabase.table('pods').select(
                '*').eq('id', id).execute()
            if not response.data:
                return jsonify({'error': 'Pod not found'}), 404
            return jsonify(response.data[0]), 200
        except Exception as e:
            print(e)
            return jsonify({'error': 'Error fetching data'}), 500
