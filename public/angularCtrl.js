angularApp.controller('angularCtrl', ['$scope', 'dbService', function ($scope, dbService) {
    "use strict";
    $scope.$on('localDbStatus', function (event, data) {
        $scope.localServerInfo = data;
        $scope.$apply();

        fetchRecords();
    });

    function fetchRecords() {
        dbService.fetchRecords().then(function (res) {
            // console.log (res);
            $scope.myData = [];
            for (var i = 0; i < res.rows.length; i++) {
                $scope.myData.push({
                    "id": res.rows[i].doc._conflicts ? "*" + res.rows[i].doc._id : res.rows[i].doc._id,
                    "name": res.rows[i].doc.name,
                    "price": res.rows[i].doc.price,
                });
            }
        }, function (err) {
            console.log(err);
        });

    }

    $scope.$on('remoteDbStatus', function (event, data) {
        $scope.remoteServerInfo = data;
        $scope.$apply();
    });

    $scope.$on('syncStatus', function (event, data) {
        $scope.syncStatus = data;
        $scope.$apply();
    });

    $scope.update = function (item) {
        dbService.putRecord(item).then((res) => {
            $scope.updateStatus = "Success";
            fetchRecords();
        }, (err) => {
            $scope.updateStatus = "failure:" + err;
        });
    };

    dbService.connectToServices();

    // setInterval(()=>{
    //     var d = {
    //         "id": 8,
    //         "name":"glove",
    //         "price":"$4"
    //     };
    //     dbService.putRecord(d);
    // }, 10000);

    // $scope.myData = [
    //     {
    //         "firstName": "ajay",
    //         "lastName": "kommineni"
    //     }, {
    //         "firstName": "dhriti",
    //         "lastName": "kommineni"
    //     }, {
    //         "firstName": "sahasra",
    //         "lastName": "kommineni"
    //     }, {
    //         "firstName": "chaitanya",
    //         "lastName": "govada"
    //     }
    // ];
}]);