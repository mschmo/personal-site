from urlparse import urljoin
from flask import Flask, render_template, url_for
from flask_flatpages import FlatPages
from werkzeug.contrib.atom import AtomFeed

from config_default import HOSTING_DOMAIN

app = Flask(__name__)
app.config.from_pyfile('config_default.py')
app.config.from_pyfile('config_local.py')
pages = FlatPages(app)


@app.route('/')
def index():
    return render_template('index.html', posts=_get_articles_by_date())


@app.route('/atom.xml')
def feed():
    atom_feed = AtomFeed('Recent Articles',
                         feed_url=urljoin(HOSTING_DOMAIN, url_for('feed')),
                         url=HOSTING_DOMAIN)
    articles = _get_articles_by_date()[:5]
    for article in articles:
        atom_feed.add(article.meta['title'],
                      author='Matt Schmoyer',
                      url=urljoin(HOSTING_DOMAIN, article.path),
                      updated=article.meta['published'],
                      published=article.meta['published'])
    return atom_feed.get_response()


@app.route('/<path:path>/')
def post(path):
    page = pages.get_or_404(path)
    return render_template('post.html', post=page)


@app.route('/projects/crypto-presentation/')
def crypto_presentation():
    return render_template('projects/crypto_presentation.html')


@app.route('/projects/speech-presentation/')
def speech_presentation():
    return render_template('projects/speech_presentation.html')


def _get_articles_by_date():
    articles = (p for p in pages if 'published' in p.meta)
    return sorted(articles, reverse=True, key=lambda p: p.meta['published'])
