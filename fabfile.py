import os
import sys

import boto
import boto.s3
from boto.s3.connection import OrdinaryCallingFormat
from fabric.api import *
from flask_frozen import Freezer

from server.app import app


BUCKET_NAME = 'mattschmoyer.com'
MAX_SIZE = 20 * 1000 * 1000
PART_SIZE = 6 * 1000 * 1000


def percent_cb(complete, total):
    sys.stdout.write('.')
    sys.stdout.flush()


@task
def freeze_app():
    freezer = Freezer(app)
    freezer.freeze()


@task
def deploy():
    # TODO - Don't forget to handle cache busting/invalidation crap if you're using a CDN
    freeze_app()
    conn = boto.connect_s3(calling_format=OrdinaryCallingFormat())
    bucket = conn.get_bucket(BUCKET_NAME, validate=False)
    upload_file_names = []
    source_dir = os.path.join(os.getcwd(), 'server/build')
    for source, dir_names, file_names in os.walk(source_dir):
        for file_name in file_names:
            upload_file_names.append(os.path.join(source, file_name))
    for filename in upload_file_names:
        dest_path = filename.replace(source_dir, '')
        print('Uploading {} to Amazon S3 bucket {}'.format(filename, BUCKET_NAME))
        file_size = os.path.getsize(filename)
        if file_size > MAX_SIZE:
            print('multipart upload')
            mp = bucket.initiate_multipart_upload(dest_path)
            fp = open(filename, 'rb')
            fp_num = 0
            while fp.tell() < file_size:
                fp_num += 1
                print('uploading part {}'.format(fp_num))
                mp.upload_part_from_file(fp, fp_num, cb=percent_cb, num_cb=10, size=PART_SIZE)
            mp.complete_upload()
        else:
            print('singlepart upload')
            k = boto.s3.key.Key(bucket)
            k.key = dest_path
            k.set_contents_from_filename(filename, cb=percent_cb, num_cb=10)
