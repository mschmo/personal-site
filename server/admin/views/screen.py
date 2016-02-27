import json
import requests
import xml.etree.ElementTree as ET
from flask import Blueprint, render_template, current_app, jsonify, request


admin = Blueprint('admin', __name__, url_prefix='/admin', template_folder='templates',
    static_folder='static')

def get_instagram_feed(app, user_id=219073714):
    params = {
        'client_id': app.config['INSTAGRAM_CLIENT_ID'],
        'count': 10
    }
    url = 'https://api.instagram.com/v1/users/{}/media/recent'.format(user_id)
    response = json.loads(requests.get(url, params=params).text)
    return [media['images']['standard_resolution']['url'] for media in response['data']]

def get_news_headlines(category='top'):
    url = 'http://feeds.reuters.com/reuters/{}News?format=xml'.format(category)
    feed = ET.fromstring(requests.get(url).text.encode('utf-8'))
    return [title.text for title in feed.iter('title')][2:20]


@admin.route('/screen')
def schmo_screen():
    slides = get_instagram_feed(current_app)
    headlines = get_news_headlines()
    return render_template('admin/schmo_screen.html', slides=slides, headlines=headlines)


# AJAX
@admin.route('/news_headlines')
def news_headlines():
    category = request.args.get('category', 'top')
    headlines = get_news_headlines(category)
    return ''.join(['<li>{}</li>'.format(title) for title in headlines])
