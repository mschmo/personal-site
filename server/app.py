from flask import Flask, render_template


#Create and configure the Flask app.
app = Flask(__name__)
app.config.from_pyfile('config_default.py')

@app.route('/')
def index():
    return render_template('index.html')
