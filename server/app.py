import json
import requests
from urlparse import urljoin
from flask import Flask, render_template, request
from flask_flatpages import FlatPages
from werkzeug.contrib.atom import AtomFeed

app = Flask(__name__)
app.config.from_pyfile('config_default.py')
app.config.from_pyfile('config_local.py')
pages = FlatPages(app)


@app.route('/')
def index():
    return render_template('index.html', posts=_get_articles_by_date())


@app.route('/send_message/', methods=['POST'])
def send_message():
    form = request.form
    response = requests.post(app.config['MAILGUN_MESSAGE_URL'],
                             auth=('api', app.config['MAILGUN_API_KEY']),
                             data={
                                 'from': form['sender'],
                                 'to': 'mattschmo@gmail.com',
                                 'subject': 'New Message From Your Site',
                                 'html': render_template('email.html',
                                                         message=form['message'],
                                                         sender=form['sender'])
                             })
    return json.dumps({'success': response.text})


@app.route('/feed.atom/')
def feed():
    atom_feed = AtomFeed('Recent Articles', feed_url=request.url, url=request.url_root)
    articles = _get_articles_by_date()[:5]
    for article in articles:
        atom_feed.add(article['title'],
                      author='Matt Schmoyer',
                      url=urljoin(request.url_root, article.path),
                      updated=article['published'],
                      published=article['published'])
    return atom_feed.get_response()


@app.route('/<path:path>/')
def post(path):
    page = pages.get_or_404(path)
    return render_template('post.html', post=page)


@app.route('/projects/crypto-presentation')
def crypto_presentation():
    return render_template('projects/crypto_presentation.html')


def _get_articles_by_date():
    articles = (p for p in pages if 'published' in p.meta)
    return sorted(articles, reverse=True, key=lambda p: p.meta['published'])
