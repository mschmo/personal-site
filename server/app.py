from urlparse import urljoin
from flask import Flask, render_template, request
from flask_flatpages import FlatPages
from werkzeug.contrib.atom import AtomFeed


app = Flask(__name__)
app.config.from_pyfile('config_default.py')
pages = FlatPages(app)


@app.route('/')
def index():
    articles = sorted(pages, reverse=True, key=lambda p: p.meta['date'])
    return render_template('index.html', posts=articles)

@app.route('/test')
def test():
    return 'Hello person'

@app.route('/feed.atom')
def feed():
    feed = AtomFeed('Recent Articles', feed_url=request.url, url=request.url_root)
    articles = sorted(pages, reverse=True, key=lambda p: p.meta['date'])[:5]
    for article in articles:
        feed.add(article['title'],
                author='Matt Schmoyer',
                url=urljoin(request.url_root, article.path),
                updated=article['date'],
                published=article['date'])
    return feed.get_response()

@app.route('/<path:path>/')
def post(path):
    post = pages.get_or_404(path)
    return render_template('post.html', post=post)