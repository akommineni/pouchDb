"use strict";

var db = new PouchDB('sports');
var remoteDb = new PouchDB('http://localhost:3000/db/baseball');

db.info().then(function (info) {
    console.log('local db=' + JSON.stringify(info));
}, function(err){
    console.log ('local db error=' + JSON.stringify(err));
});

remoteDb.info().then(function (info) {
    console.log('remote  db=' + JSON.stringify(info));
}, function(err){
    console.log ('remote db error=' + JSON.stringify(err));
});

const sync = db.sync(remoteDb, {
    live: true,
    retry: true
});

db.changes({
    live: true,
    include_docs: true //Include all fields in the doc field
  }).on('change', function(changes){
      console.log ('changes:' + JSON.stringify(changes.doc));
  }).on('error', function(err){
      console.log ('error:' + err);
  });
