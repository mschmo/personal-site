import os
import mimetypes

import boto3
from flask_frozen import Freezer

from server.app import app


BUCKET = 'mattschmoyer.com'


def freeze_app():
    freezer = Freezer(app)
    freezer.freeze()


def deploy(maintenance=False):
    """
    Freeze and put files to S3
    TODO: Handle cache busting/invalidation crap if you're using a CDN

    :param maintenance: When true set index.html to placeholder maintenance message
    """
    s3 = boto3.client('s3')

    if maintenance:
        maintenance_file = os.path.join(os.getcwd(), 'server/static/maintenance.html')
        print(f'Setting maintenance landing page from {maintenance_file}')
        s3.upload_file(maintenance_file, BUCKET, 'index.html', ExtraArgs={'ContentType': 'text/html'})
        return

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
        print(f'Uploading {file_name} to Amazon S3 bucket {BUCKET}')
        s3.upload_file(file_name, BUCKET, dest_path, ExtraArgs=extra_args)


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser('Deploy your site!')
    parser.add_argument('-m', '--maintenance', action='store_true', help='Flag to set maintenance landing page')
    args = parser.parse_args()

    deploy(args.maintenance)
