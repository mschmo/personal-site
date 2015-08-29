from flask import Blueprint, render_template


admin = Blueprint('admin', __name__, url_prefix='/admin', template_folder='templates',
    static_folder='static')

@admin.route('/')
def index():
    return render_template('admin/index.html')

@admin.route('/screen')
def schmo_screen():
    return render_template('admin/schmo_screen.html')