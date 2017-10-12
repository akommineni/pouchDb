angularApp.service('dbService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {
    "use strict";
    var me = this;

    var db = new PouchDB('catalog');
    var remoteDb = new PouchDB('http://localhost:3000/db/catalog');

    me.records = {};

    $rootScope.$broadcast('localDbStatus', {
        "status": "connecting"
    });
    $rootScope.$broadcast('remoteDbStatus', {
        "status": "connecting"
    });
    
    me.connectToServices = function () {
        //connect to local db
        db.info().then(function (info) {
            console.log('local db=' + JSON.stringify(info));
            $rootScope.$broadcast('localDbStatus', {
                "status": "connected",
                "desc": JSON.stringify(info)
            });
        }, function (err) {
            console.log('local db error=' + JSON.stringify(err));
            $rootScope.$broadcast('localDbStatus', {
                "status": "error",
                "desc": JSON.stringify(err)
            });
        });

        //connect to remote db
        remoteDb.info().then(function (info) {
            console.log('remote  db=' + JSON.stringify(info));
            $rootScope.$broadcast('remoteDbStatus', {
                "status": "connected",
                "desc": JSON.stringify(info)
            });
        }, function (err) {
            console.log('remote db error=' + JSON.stringify(err));
            $rootScope.$broadcast('remoteDbStatus', {
                "status": "error",
                "desc": JSON.stringify(err)
            });
        });

        //start syncing
        db.sync(remoteDb, {
            live: true,
            retry: true
        }).on('change', change => {
            console.log('Something changed -> ', change)
            $rootScope.$broadcast('syncStatus', {
                "status": "change",
                "desc": JSON.stringify(change)
            });
        }).on('paused', info => {
            console.log('Sync paused -> ', info)
            $rootScope.$broadcast('syncStatus', {
                "status": "paused"
            });
        }).on('active', info => {
            console.log('Sync is active again -> ', info)
            $rootScope.$broadcast('syncStatus', {
                "status": "active"
            });
        }).on('error', err => {
            $rootScope.$broadcast('syncStatus', {
                "status": "error",
                "desc": JSON.stringify(err)
            });
        });
    }

    me.fetchRecords = function(){
        var d = $q.defer();
        //TODO: Not worrid about the race conditions, assume db is already conneted
        db.allDocs({include_docs: true, conflicts:true}).then(function(response){
            d.resolve(response);
        }, function(err){
            d.reject(err);
        });
        return d.promise;   
    };

    me.putRecord = function(item) {
        //TODO: No error checking before passing in
        var d = $q.defer();
        db.put(item).then((res)=>{
            d.resolve(res);
        },(err)=>{
            d.reject(err);
        });
        return d.promise;           
    };
}]);