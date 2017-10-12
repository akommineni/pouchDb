1.  Install nodejs
2.  Install Couch DB
    - Couch Db installed as Windows service    
    - To test offine, stop the service
3. checkout project
4. From command prompt, navigate to root of the folder
5. Run "npm install"
6. Run "node app.js"
7. From browser, go to http://localhost:3000 for app
8. From browser, go to http://localhost:5984/_utils  for couch db web interface

NOTE: This app is configured to run with local couch db, to change the url update "remoteDbBaseUrl" variable in ./app.js file.