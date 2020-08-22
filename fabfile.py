import os
import mimetypes

import boto3
from fabric.api import *
from flask_frozen import Freezer

from server.app import app


BUCKET = 'mattschmoyer.com'


@task
def freeze_app():
    freezer = Freezer(app)
    freezer.freeze()


@task
def deploy():
    """
    Freeze and put files to S3
    """
    s3 = boto3.client('s3')

    # TODO - Handle cache busting/invalidation crap if you're using a CDN
    freeze_app()
    upload_file_names = []
    source_dir = os.path.join(os.getcwd(), 'server/build')
    for source, dir_names, file_names in os.walk(source_dir):
        for file_name in file_names:
            upload_file_names.append(os.path.join(source, file_name))
    for file_name in upload_file_names:
        dest_path = file_name.replace(source_dir, '').lstrip('/')
        extra_args = {}
        content_type = mimetypes.guess_type(file_name)[0]
        if content_type:
            extra_args['ContentType'] = content_type
        print('Uploading {} to Amazon S3 bucket {}'.format(file_name, BUCKET))
        s3.upload_file(file_name, BUCKET, dest_path, ExtraArgs=extra_args)
