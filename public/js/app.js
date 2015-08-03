var app = angular.module('oseam-app', ['ngMaterial', 'mdDateTime'])
    .config(function($mdThemingProvider) {
      var background = $mdThemingProvider.extendPalette('grey', {
        'A100': 'efefef'
      });

      $mdThemingProvider.definePalette('background', background);
      $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('green', {
          'default': '400'
        });

      $mdThemingProvider.theme('background-fix')
        .primaryPalette('teal')
        .accentPalette('green', {
          'default': '400'
        })
        .backgroundPalette('background');
      });

app.controller('AppCtrl', [
  '$scope',
  '$http',
  '$mdSidenav',
  '$mdDialog',
  function ($scope, $http, $mdSidenav) {
    $scope.toggleSidenav = function (menuId) {
      $mdSidenav(menuId).toggle();
    };

    // If data will be filled, Define the object/variable before anything happens
    $scope.formData = {};
    // Set scope error to notify user when there is any error.
    $scope.error;
    //  This scope is use to teporary store user activity when booking
    $scope.findService = {};

    // Provider booking
    $scope.service = {};

    // Booking list
    $scope.bookingList = {};

    // This is the data we send off for booking
    $scope.clickedService = {};

    $scope.isLoggedIn = localStorage.getItem('token');
    $scope.userID = localStorage.getItem('id');

    if(window.isLoggedIn == true) {
      $scope.links = [
        { name: 'Home', img: 'https://google.github.io/material-design-icons/action/svg/design/ic_home_24px.svg', url: '/home' },
        { name: 'Profile', img: 'https://google.github.io/material-design-icons/social/svg/design/ic_person_24px.svg', url: '/profile/' + $scope.userID },
        { name: 'View Bookings', img: 'https://google.github.io/material-design-icons/image/svg/design/ic_collections_bookmark_24px.svg', url: '/bookings' },
        { name: 'Find a gardener', img: 'https://google.github.io/material-design-icons/maps/svg/design/ic_local_florist_24px.svg', url: '/find-service' },
        { name: 'Logout', img: 'https://google.github.io/material-design-icons/action/svg/design/ic_exit_to_app_24px.svg', url: '/logout' }
      ];
    } else {
      $scope.links = [
        { name: 'Home', img: 'https://google.github.io/material-design-icons/action/svg/design/ic_home_24px.svg', url: '/home' },
        { name: 'Login', img: 'https://google.github.io/material-design-icons/social/svg/design/ic_person_24px.svg', url: '/login' },
        { name: 'Register', img: 'https://google.github.io/material-design-icons/social/svg/design/ic_person_24px.svg', url: '/register' }
      ];
    }

    $scope.user = {
      email: ''
    };

    $scope.register = function() {
      $http({
        method  : 'POST',
        url     : 'https://oseam.herokuapp.com/api/v1/user',
        data    : $.param($scope.formData),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(function(data) {
        if (!data.success) {
          // User is now Authorized
          $('#toolbarRegister').removeClass('hidden');
          $('#toolbarRegister').removeClass('md-warn');
          $('#toolbarRegister').addClass('md-accent');
          $('#register-content').html('Successfully Registered!');

          // Wait 3 seconds to then proceed to the home page
          setTimeout(function(){window.location = '/home'},3000);
        } else {
          console.error(data.message);
          // Give the user a visual representation of the error (md-warn toolbar)
          $('##toolbarRegister').removeClass('hidden');
          $('#toolbarRegister').addClass('md-warn');
          $('#register-content').html(data.message);
        }
      }).error(function(data) {
        // Console Error - Debugging
        console.error(data[0].message);
        // console.log(data);

        // Give the user a visual representation of the error (md-warn toolbar)
        $('#toolbarRegister').removeClass('hidden');
        $('#toolbarRegister').addClass('md-warn');
        $('#register-content').html(data[0].message);
      });
    };

    $scope.login = function() {
      $http({
        method  : 'POST',
        url     : 'https://oseam.herokuapp.com/api/v1/user_login',
        data    : $.param($scope.formData),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(function(data) {
        if (!data.success) {
          // Gather Information from Returned Data
          var userToken = data['token'];
          var userID = data.user['id'];

          // Store user information locally
          localStorage.setItem("token", userToken);
          localStorage.setItem("id", userID);

          // Set a variable for all pages to know if user is logged in or not (checking against local storage does not work)
          window.isLoggedIn = true;

          // User is now Authorized
          $('#toolbarLogin').removeClass('hidden');
          $('#toolbarLogin').removeClass('md-warn');
          $('#toolbarLogin').addClass('md-accent');
          $('#login-content').html('Successfully Logged in!');

          // Wait 3 seconds to then proceed to the home page
          setTimeout(function(){window.location = '/home'},3000);

        } else {
          // output error to Console
          console.log(data.message);

          // Give the user a visual representation of the error (md-warn toolbar)
          $('#toolbarLogin').removeClass('hidden');
          $('#toolbarLogin').addClass('md-warn');
          $('#login-content').html(data.message);

        }
      }).error( function(data) {
        console.log(data.message);
        // Give the user a visual representation of the error (md-warn toolbar)
        $('#toolbarLogin').removeClass('hidden');
        $('#toolbarLogin').addClass('md-warn');
        $('#login-content').html(data.message);
      });
    };

    // Need to initialize this scope at the beginning
    $scope.homeServices = function() {
      if(localStorage.getItem('token')) {
        window.userHomePage = true;
        $http({
          method  : 'GET',
          url     : 'https://oseam.herokuapp.com/api/v1/services',
        })
        .success(function(data, status) {
          // Check if status is 200 inject services scope.
          if (status === 200) {
            $scope.services = data;

            for(i = 0; i < data.length; i++) {
              // Booking Times
              $scope.services[i].updatedAt = new Date( data[i].updatedAt );
              $scope.services[i].updatedAt = $scope.services[i].updatedAt.toString();
              $scope.services[i].updatedAt = $scope.services[i].updatedAt.slice(0, -19);
              console.log($scope.services[i].updatedAt);

              $scope.services[i].name = $scope.services[i].name.replace(/_/g, ' ');
            }

          // Can use map and concat to get service name flexibly. Create a list of services for user to choose.
            $scope.serviceName = ['mowing', 'leaf_removal', 'yard_cleaning'];
          } else {
            $scope.error = 'Server error';
            console.error(data);
          }
        }).error();
      } else {
        $("#homeContent").html("<md-card><md-card-content><h2 class='md-title align-center'>Paracosm</h2><p>The titles of Washed Out's breakthrough song and the first single from Paracosm share the two most important words in Ernest Greene's musical language: feel it. It's a simple request, as well...</p></md-card-content></md-card>");
      }
    };

    $scope.getService = function() {
      var conf = $scope.findService;
      $http({
        method  : 'GET',
        url     : 'https://oseam.herokuapp.com/api/v1/services',
        params  : conf,
      })
      .success(function(data, status) {
        // Check if status is 200 inject services scope.
        if (status === 200) {
          $scope.services = data;
          console.log(data);

          $("#findGrid").html('');

          $.each(data, function(key, value){
            // Remove _ from Names
            var name = value.name.replace(/_/g, ' ');

            // Append each item to their own card
            $("#findGrid").append('<md-card flex><a href="#" class="findGrid-content" id="'+ value.id +'"><md-card-content class="align-center capitalize"><h2 class="md-title">'+ name +'</h2><h3>Size: '+ value.type +'</h3><p>Expected Duration: '+ Math.floor((value.duration/360000) << 0) +' Hours</p></md-card-content></a></md-card>');

            $("#"+ value.id).click(function() {
              var name = value.name;
              // Set data to clickedService
              $scope.clickedService = {
                "services": [ name ],
                "estimatedDuration": value.duration,
                "type": value.type
              };

              console.log($scope.clickedService);

              // Remove class incase you clicked another card before this one.
              $("a").removeClass('selected');

              // Add selected Class to card you have clicked
              $("#"+ value.id).addClass('selected');

              // Hide it with 700ms delay
              $("#findGrid").hide(700);
              $("#service-selection").hide(700);
              $("#findTime").removeClass('hidden');
              $("#findTime").show(700);
            });

            $("#saveButton").click(function() {
              $("#findAddress").removeClass("hidden");
              $("#findAddress").show(700);
              $("#findTime").hide(700);
            });

            $("#backAddress").click(function(){
              $("#serviceProviders").html('');

              $("#createBookingCard").html('');

              $("#createBookingCardError").html('');

              $("#findTime").show(700);
              $("#findAddress").hide(700);

            });

            $("#backTime").click(function() {
              $("#findTime").hide(700);
              $("#findGrid").show(700);
              $("#service-selection").show(700);
              $scope.clickedService = {};
            });
          });
        } else {
        }
      }).error();
    };

    // When user select serviceName, listen ng-change='checkServiceName(name)'. Make a list of service type such as small, medium, large
    $scope.checkServiceName = function(name) {
      // $scope.service is the service user had chosen
      $scope.service.services = name; // services are the service names. In the future can select multiple services.

      function filterbyName(obj) {
        if ( obj.name === name ) {
          return obj;
        };
      };
      // Get serviceType by serviceName. Create a list of service types for user to choose.
      $scope.serviceType = $scope.services.filter(filterbyName(obj)).map(function(obj) { return obj.type; });
    };

    /* User select serviceType, listen ng-change='checkServiceType(type)'.
     Get service duration and return service duration.
      Need to convert duration from milliseconds to hour in view
     */
    $scope.checkServiceType = function(type) {

      function filterbyNameType(obj) {
        if ( (obj.type = type) && (obj.name = $scope.service.services) ) {
          return obj;
        };
      };
      var arr = $scope.services.filter(filterbyNameType(obj));

      // Get service duration by serviceType. Attention: duration is set in milliseconds
      $scope.service.estimatedDuration = arr[0].duration;

      // Also set other params for future use
      if ( ($scope.service.services = 'mowing') || ($scope.service.services = 'yard_cleaning') ) {  $scope.service.estimatedSize = arr[0].type };
      if ($scope.service.services = 'leaf_removal') {  $scope.service.treeNumber = arr[0].type };

      // Create two scopes for user to enter address and bookTime
      scope.service.address;
      scope.service.bookTime; // bookTime must be in millisecond
    };

    // After enter address and choose time. Find available providers
    $scope.findProviders = function() {
      $http({
        method  : 'POST',
        url     : 'https://oseam.herokuapp.com/api/v1/providers',
        data    : $.param($scope.clickedService), //If there is any error. Check this line of code. May set wrong params
        headers : { 'Content-Type': 'application/x-www-form-urlencoded',
        // Set authorization header with Bearer token
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                   }
      })
      .success(function(data, status) {
        if (status === 200) {
          // Return provider scope for view. Also need to calculate the estimated price by multiply provider wage to estimatedDuration (in hour)
          $scope.providers = data;
          window.serviceProvider = data;

          $("#serviceProviders").html('');

          $.each(data, function(key, value){
            console.log(value);
            var hours = Math.floor($scope.clickedService.estimatedDuration/360000);
            var wage = value.obj.wage;

            var totalWage = wage * hours;

            // Append each item to their own card
            $("#serviceProviders").append('<md-card id="'+ value.obj._id +'" flex><a href="#" class="findGrid-content" ><md-card-content class="align-center capitalize"><h2 class="md-title">'+ value.obj.firstName +' '+ value.obj.lastName +'</h2><p>Expected Price: $'+ totalWage +'</p></md-card-content></a></md-card>');

            $("#"+ value.obj._id).click(function() {

              // services (array), estimatedSize, address, bookTime (in milliseconds), estimatedDuration (in milliseconds), wage, providerId (when user selects provider)
              // Services
              $scope.service.services = $scope.clickedService.service;
              // Estimated Size
              if ( ($scope.service.services = 'mowing') || ($scope.service.services = 'yard_cleaning') ) {  $scope.service.estimatedSize = $scope.clickedService.type };
              if ($scope.service.services = 'leaf_removal') {  $scope.service.treeNumber = $scope.clickedService.type };
              // Address
              $scope.service.address = $scope.clickedService.address;
              // bookTime
              $scope.service.bookTime = $scope.clickedService.bookTime.getTime();
              // est duration
              $scope.service.estimatedDuration = $scope.clickedService.estimatedDuration;
              // ID
              $scope.service.providerId = value.obj._id;
              // wage
              $scope.service.wage = value.obj.wage;

              console.log($scope.service);

              localStorage["booking"] = JSON.stringify($scope.service);
              console.log(JSON.parse(localStorage['booking']));
              if(localStorage.getItem('token')) {
                $("#createBookingCard").html('');
                $("#createBookingCard").append('<md-card id="bookingCard" flex><a href="#"><md-card-content class="align-center capitalize"><h2 class="md-title">Create Booking</h2><p>Create Booking</p></md-card-content></a></md-card>');
                $("#bookingCard").click(function() {
                  $scope.createBooking();
                });
              }
            });
          });
        } else {
          $scope.error = "No provider found";
          console.log(data);
        }
      }).error(function(data, status) {
        console.log(data);
      });
    };

    // User choose service provider. Listen ng-change='chooseProvider(providerId)'. Attention: providerId is _id
    $scope.chooseProvider = function(providerId) {
      $scope.service.providerId = providerId;
      $scope.service.wage = $scope.providers.results.filter(function(obj) { if (obj.obj._id === providerId) { return obj.obj.wage }})[0];
      // Store booking info in localstorage. User is able to make booking after signup or signin
      localStorage.setItem("booking", $scope.service);
    };

    // User make booking.
    $scope.createBooking = function() {
      $http({
        method  : 'POST',
        url     : 'https://oseam.herokuapp.com/api/v1/booking',
        data    : $.param(JSON.parse(localStorage['booking'])), //Required params is stored in localstorage.
        headers : { 'Content-Type': 'application/x-www-form-urlencoded',
        // Set authorization header with Bearer token
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                   }
      })
      .success(function(data, status) {
        if (status === 201) {
          // Return booking scope to render in view
          $scope.booking = data;

          var bookingType = data.booking.services[0].replace(/_/g, ' ');

          $("#bookingCard").hide(700);
          $("#createBookingCardError").html('');
          $("#serviceProviders").hide(700);
          $("#findAddress").hide(700);

          $("#createBookingCard").append('<md-card flex><md-toolbar flex="" class="md-accent md-background-fix-theme"><div class="md-toolbar-tools"><h2 id="bookingSuccess" class="md-flex">Successfully Booked '+ data.booking.providerId.firstName +' '+ data.booking.providerId.lastName +'</h2></div></md-toolbar><md-card-content class="align-center capitalize"><md-list><md-list-item class="md-3-line"><img src="'+ data.booking.providerId.avatar +'" class="md-avatar"><div class="md-list-item-text"><h3>'+ data.booking.providerId.firstName +' '+ data.booking.providerId.lastName +'</h3><h4>Booked for '+ bookingType +'</h4><p></p></div></md-list-item></md-card-content></md-card>');
        } else {
          $scope.error = data.error;
        }
      }).error(function(data, status){
        $("#createBookingCardError").html('');
        $("#createBookingCardError").append('<md-card flex><md-toolbar flex="" class="md-warn md-background-fix-theme"><div class="md-toolbar-tools"><h2 id="errorTitle" class="md-flex">Error</h2></div></md-toolbar><md-card-content class="align-center capitalize"><h2 class="md-title">'+ data +'</h2><p>'+ status +'</p></md-card-content></a></md-card>');
      });
    };

    // User view booking info
    $scope.viewBookings = function() {
      $http({
        method  : 'GET',
        url     : 'https://oseam.herokuapp.com/api/v1/view_booking',
        data    : $.param({completed: false}), //Only view incompleted booking. Delete this line if view all bookings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded',
        // Set authorization header with Bearer token
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                   }
      })
      .success(function(data, status) {
        if (status === 200) {
          // Return bookingList scope to render in view.
          $scope.bookingList = data;

          for(i = 0; i < data.length; i++) {
            // Booking Times
            $scope.bookingTime = new Date( data[i].bookTime);
            $scope.bookTime = $scope.bookingTime.toString();
            $scope.bookTime = $scope.bookTime.slice(0, -19);

            $scope.bookingList[i].leafRemoval.name = $scope.bookingList[i].leafRemoval.name.replace(/_/g, ' ');
          }

          // $scope.bookTime = $scope.bookingList.bookTime;

          console.log(data);
        } else {
          $scope.error = "You haven't booked any service";
        }
      });
    };

    // Get initial list of notification.
    $scope.getNotifications = function() {
      $http({
        method  : 'GET',
        url     : 'https://oseam.herokuapp.com/api/v1/read_unotification',
        // Can also set data to read:false if only want to view unread notification
        headers : { 'Content-Type': 'application/x-www-form-urlencoded',
        // Set authorization header with Bearer token
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                   }
      })
      .success(function(data, status) {
        if (status === 200) {
          // Return notification scope to render in view
          $scope.notifications = data;
          if(typeof data.user_notifications[0] !== 'undefined') {
            sessionStorage.setItem('notifications', data.length);
          } else {
            sessionStorage.setItem('notifications', 0);
          }
        } else {
          $scope.error = "You haven't booked any service";
        }
      });

    };

    $scope.logout = function() {
      $http({
        method  : 'GET',
        url     : 'https://oseam.herokuapp.com/api/v1/logout'
      })
      .success(function(data) {
        if (!data.success) {
          // Set Toolbar to say Success
          $('#toolbarLogout').removeClass('hidden');
          $('#toolbarLogout').removeClass('md-warn');
          $('#toolbarLogout').addClass('md-accent');
          $('#error-content').html('Successfully Logged Out!');
          $('#card-content').html('<h1 class="align-center">You have signed out</h1><h2 class="align-center">Goodbye!</h2>')

          // Flush localStorage & sessionStorage
          localStorage.clear();
          sessionStorage.clear();
          window.isLoggedIn = false;

          // Wait 3 seconds to then proceed to the home page
          setTimeout(function(){window.location = '/home'},3000);
        } else {

          // Set Toolbar to say error
          $('#toolbarLogin').removeClass('hidden');
          $('#toolbarLogin').addClass('md-warn');
          $('#login-content').html(data);
        }
      }).error(function(data) {
        // Set Toolbar to say error
        $('#toolbarLogin').removeClass('hidden');
        $('#toolbarLogin').addClass('md-warn');
        $('#login-content').html(data);
      });
    };

  }
]);
