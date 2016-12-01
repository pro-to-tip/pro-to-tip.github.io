  var app = angular.module('Wikipedia', []);
  app.factory('GetSearch', function($http) {
    var wiki = {};
    wiki.jsonp = '&callback=JSON_CALLBACK';
    wiki.getWiki = function(term) {
      var endPoint = 'https://ru.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=15&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=';
      return $http.jsonp(endPoint + term + wiki.jsonp);
    };

    wiki.getRandom = function() {
      var endPoint = 'http://randomword.setgetgo.com/get.php';
      return $http.jsonp(endPoint + "?callback=JSON_CALLBACK");
    };

    return wiki;
  });

  app.controller('MainCtrl', function(GetSearch, $scope) { /*Model data bank*/
    $scope.MainData = {};
    $scope.MainData.results = [];
    $scope.MainData.listen = null;
    $scope.MainData.search = function(term) {
      GetResults($('input.dirty').val());
    };

    // on random search call this
    $scope.MainData.Random = function(term) {
      RandomSearch(term);
    };

    //When Mic icon is clicked
    $scope.MainData.Speech = function(url) {
      StartSpeech();
    };

    // GET  SEARCH 'from wikipedia'
    function GetResults(term) {
      $('input.dirty').val(''); //clear input field
      GetSearch.getWiki(term).success(function(data) {
        Render(data);
      });
    }

    // GET RANDOM WORD
    function RandomSearch() {
      GetSearch.getRandom().success(function(data) {
        GetResults(data.Word); // search with random word
        $scope.MainData.val = data.Word;
      });
    }

    //Render Data
    function Render(data) {
      var url = 'http://ru.wikipedia.org/?curid=';
      var Value = data.query.pages;
      $scope.MainData.results = []; // reset data
      for (var key in Value) {
        var obj = {};
        var insideValue = Value[key];
        obj.title = insideValue.title;
        obj.text = insideValue.extract;
        obj.url = url + insideValue.pageid;
        $scope.MainData.results.push(obj);
      }
    }

    /*auto completion*/
    $(document).ready(function() {
      $(".dirty").autocomplete({

        source: function(request, response) {
          $.ajax({
            url: "https://ru.wikipedia.org/w/api.php",
            dataType: "jsonp",
            data: {
              'action': "opensearch",
              'format': "json",
              'search': request.term,
              'gsrlimit': 8
            },
            success: function(data) {
              response(data[1]);
              $scope.$apply();
            }
          });
        },
        select: function(event, ui) {
          $scope.MainData.search();
        }

      });

    });

    //notification sounds
    var findSound = "http://oringz.com/ringtone/just-like-magic/sounds-948-just-like-magic/?download"
    var wikiSound = 'http://oringz.com/ringtone/gets-in-the-way/sounds-874-gets-in-the-way/?download';
    var findAudio = new Audio(findSound);
    var wikiAudio = new Audio(wikiSound);

    // Voice search
    function StartSpeech() {
      $('input.dirty').val(''); //clear input field
      if ($scope.MainData.listen) {
        $scope.MainData.listen = null;
        animate();
        return annyang.abort();
      } else {
        animate();
        $scope.MainData.listen = true;
        var commands = {
          'find *term': function(term) {
            GetResults(term);
            $scope.MainData.listen = null;
            $scope.MainData.val = term;
            animate();
            findAudio.play();
            return annyang.abort();

          },
          'wikipedia': function(term) {
            wikiAudio.play();
            //change placeholder
            $("input.dirty").attr("placeholder", 'Say "Find" + any Word').val("")
          },

        };

        annyang.addCommands(commands);
        annyang.start();
      }
    }

    // change placeholder and toggle some classes
    function animate() {
      $("input.dirty").attr("placeholder", 'Say "Wikipidia"').val("")
      $('.icon').toggleClass('listen');
    }

  });
