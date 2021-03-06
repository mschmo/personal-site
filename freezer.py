#!/usr/bin/env python
from server.app import app
from flask_frozen import Freezer


freezer = Freezer(app)

if __name__ == '__main__':
    freezer.run(debug=True)
