from flask import Flask, render_template
from flask_flatpages import FlatPages


app = Flask(__name__)
app.config.from_pyfile('config_default.py')
posts = FlatPages(app)


@app.route('/')
def index():
    return render_template('index.html', posts=posts)


@app.route('/<path:path>/')
def post(path):
    post = posts.get_or_404(path)
    return render_template('post.html', post=post)