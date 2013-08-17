#!/usr/bin/env python
from flask.ext.script import Manager
from server import create_app

app = create_app()
manager = Manager(app)

if __name__ == "__main__":
    manager.run()