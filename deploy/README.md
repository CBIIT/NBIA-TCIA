# Local NBIA Install

* Copy NBIA war files into `./webapps`
* Copy NBIA javascript apps (nbia-search, nbia-admin, nbia-uat, etc) into `./html`
* Use NBIA Downloader to download the test data into `./dicoms`
* `docker compose up`
* Once environment is live import dicom files using `python insert_dicoms.py dicoms/metadata.csv yourusername`
* Log into [nbia-search](http://localhost/nbia-search), then go to 'User Admin' and assign collections to either protection group
* Log into [nbia-admin](http://localhost/nbia-admin), set all collections to public

# Logs
Logs can be viewed with `docker compose logs tomcat -f`

# Deploying new builds
The javascript apps can be replaced without any additional steps, however new war files need the tomcat container to restart.
`docker compose restart tomcat`
