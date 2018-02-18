Built with Python 3.6.2

## Deploy
Freeze the latest state of the site:
```bash
$ fab freeze
```
This will update `server/build` with a compiled static version of the site. Next, to push that to the S3 bucket that will serve those static files:
```bash
$ fab deploy
```
