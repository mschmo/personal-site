import json
import requests
from flask import Blueprint, render_template, current_app, jsonify


admin = Blueprint('admin', __name__, url_prefix='/admin', template_folder='templates',
    static_folder='static')

def get_instagram_feed(app):
    params = {
        'client_id': app.config['INSTAGRAM_CLIENT_ID'],
        'count': 10
    }
    response = json.loads(requests.get('https://api.instagram.com/v1/users/219073714/media/recent', params=params).text)
    return [media['images']['standard_resolution']['url'] for media in response['data']]

@admin.route('/')
def index():
    return render_template('admin/index.html')

@admin.route('/screen')
def schmo_screen():
    slides = get_instagram_feed(current_app)
    return render_template('admin/schmo_screen.html', slides=slides)