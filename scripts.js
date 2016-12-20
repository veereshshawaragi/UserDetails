var app = angular.module("myApp", ['ngRoute']);

app.config(function($routeProvider){
    $routeProvider
    .when( '/', {
       templateUrl: 'pages/login.html'   
    })
    .when('/dashboard', {
        resolve:{
            "check": function($location, $rootScope){
                if(!$rootScope.loggedIn ){
                    $location.path('/');
                }
            }
        },        
        templateUrl: 'pages/dashboard.html'
    })
    .when('/addUser', {
            resolve:{
            "check": function($location, $rootScope){
                if(!$rootScope.loggedIn ){
                    $location.path('/');
                }
            }
        },     
        templateUrl: 'pages/addUser.html'   
    })
    .when('/updateUser', {
        resolve:{
            "check": function($location, $rootScope){
                if(!$rootScope.loggedIn ){
                    $location.path('/');
                }
            }
        },     
        templateUrl: 'pages/updateUser.html'
    })
    .otherwise({
        redirectTo: '/' 
    });    
});

// Login Controller
app.controller('loginCtrl', function($scope, $location, $rootScope, $http) {
	$scope.submit = function(){    
        $http.post('http://reqres.in/api/login', {
             "email": $scope.username,
             "password": $scope.password
            
        }).then(
        function successCallback() {
            $rootScope.loggedIn = true;
            $location.path('/dashboard');            
          
        },function errorCallback() {
            bootbox.alert("Bad Request or Server side error");          
        });
    };
});

// Dashboard Controller
app.controller('dashboardCtrl', function ($scope, $http, $location, $rootScope){
    $http({
      method: 'GET',
      url: 'http://reqres.in/api/users?page=2'
    }).then(function successCallback(response) {
            $rootScope.userData = response.data.data;
    }, function errorCallback(response) {
            bootbox.alert("Bad Request or Server side error"); 
    }); 
    
    $scope.Add = function(){
      $location.path('/addUser');            
    }
    
    $scope.Edit = function(userid){
       $location.path('/updateUser');   
       $rootScope.updateId=userid;  
    }
    
    $scope.Delete = function(userid){    
        bootbox.confirm("Do you want to delete this User", function(result){
            if(result){
               $http({
                    method: 'DELETE',
                    url: 'http://reqres.in/api/users/?'+userid
                }).then(function successCallback(response) {
                    bootbox.alert("The user is deleted Successfully");
                }, function errorCallback(response) {
                    bootbox.alert("Bad Request or Server side error");          
                }); 
            }
        });     
    }
});

// Add User Controller
app.controller('addUserCtrl', function($scope, $http, $location, $rootScope){
     $scope.userName = "";
     $scope.userJob = ""; 
     $scope.addUser = function(){        
          $http.post('http://reqres.in/api/users', {
             "name": $scope.userName,
             "job": $scope.userJob            
        }).then(
        function successCallback() {
            $rootScope.loggedIn = true;
            bootbox.alert("User Added Successfully");
            $location.path('/dashboard');            
        },function errorCallback() {
            bootbox.alert("Bad Request or Server side error");          
        });
    };
    $scope.BackToDashboard= function(){
        $rootScope.loggedIn = true;
        $location.path('/dashboard');  
    }
});

// Update Controller
app.controller('updateUserCtrl', function($scope, $http, $location, $rootScope){
    
    // Get userdetails based on id
     angular.forEach($rootScope.userData, function(x) {
            if ($rootScope.updateId==x.id){ 
                $scope.userName=x.first_name;
                $scope.userId=x.id;
            };
        });
    
     $scope.updateUser = function(){    
        $http({
            method: 'PUT',
            url: 'http://reqres.in/api/users/?'+$scope.userId,
            data: {  "name": $scope.userName,  "job": $scope.userJob}
        }).then(function successCallback(response) {
            $rootScope.loggedIn = true;
            bootbox.alert("The user is update successfully");
            $location.path('/dashboard');            
        }, function errorCallback(response) {
         bootbox.alert("Bad Request or Server side error");          
        }); 
    } 
    $scope.BackToDashboard= function(){
        $rootScope.loggedIn = true;
        $location.path('/dashboard');  
    }
});
               





