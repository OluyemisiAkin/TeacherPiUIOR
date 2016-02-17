'use strict';
/* Controllers */
angular.module('app')
  .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window','$cookieStore','$timeout','$state',
    function(              $scope,   $translate,   $localStorage,   $window, $cookieStore, $timeout,$state) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');
      // if ($cookieStore.get('globals') != undefined){
      // $scope.user_data = $cookieStore.get('globals').currentUser;
      //   var data = function (){
      //     $scope.user_data = $cookieStore.get('globals').currentUser;
      //   }
      //   $timeout(data,2000)
      // }

      // if ($cookieStore.get('globals') != undefined){
      // var user_data = $cookieStore.get('globals').currentUser;
      // console.log(user_data)
      //   if (user_data['is_staff']){
      //     $state.go('app2.instructor.dashboard');
      //   }else{
      //     $state.go('app.student.dashboard');
      //   }        
      // }      

      // config          
      $scope.app = {
        name: 'Teacher Pi',
        version: '1.0.0',
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-primary',
          navbarCollapseColor: 'bg-primary',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        }
      }

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = { isopen: false };
      $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }    

  }]);
