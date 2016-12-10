'use strict';
/* global parseCommand, Messages, lodash */

var _ = lodash;

if (Meteor.isClient) {

  $(function() {
    var $input = $('.input');
    $input.focus();
    $('.container').on('click', function() {
      $input.focus();
    });

    $input.on('keydown keyup keypress', function(e) {
      $('.new-output').text($input.val());

      if (_.includes([37,38,39,40], e.keyCode)) {
        $input.setCursorPosition($input.val().length);
      }
    });

    $.fn.setCursorPosition = function(pos) {
      this.each(function(index, elem) {
        if (elem.setSelectionRange) {
          elem.setSelectionRange(pos, pos);
        } else if (elem.createTextRange) {
          var range = elem.createTextRange();
          range.collapse(true);
          range.moveEnd('character', pos);
          range.moveStart('character', pos);
          range.select();
        }
      });
      return this;
    };

  });

  var sendAndClear = function(event) {
    var $input = $(event.target).find('.input');
    var text = $input.val();

    $input.val('');
    parseCommand(text);
  };

  Template.body.helpers({
    messages: function () {
      return Messages.find({}, {sort: {createdAt: 1}});
    }
  });

  Template.body.events({
    'submit .prompt-form': function(e) {
      e.preventDefault();
      sendAndClear(e);
    },
    'keypress .prompt-form': function(e) {
      $("html, body").stop(true).animate({
        scrollTop: $(document).height()
      }, "slow");
    }
  });



}

if (Meteor.isServer) {
  Meteor.startup(function () {

    function messagePostViaServer(message) {
      return Messages.insert({
        text: message,
        glitchText: message.toUpperCase(),
        createdAt: new Date()
      });
    }

    return Meteor.methods({
      removeAllPosts: function() {
        var timeout = 10;
        var timer = Meteor.setInterval(function(){
          var secondPlural = (timeout>1) ? ' seconds' : ' second';
          messagePostViaServer([
              'All messages will be deleted after ',
              timeout,
              secondPlural
            ].join(''));
          timeout--;
          if (timeout === -1) {
            Messages.remove({});
            messagePostViaServer('/Messages wiped out/. Type something here ↓');
            Meteor.clearInterval(timer);
          }
        }, 1000);
      },
      postImageFromGoogle: function(q) {
        var json = HTTP.get(
            'https://ajax.googleapis.com/ajax/services/search/images', {
              params: {
                v: '1.0',
                hl: 'ru',
                q: q
              }
            }).data;
        var url = json.responseData.results[0] &&
            json.responseData.results[0].url;
        messagePostViaServer([
            '<a href="',
            url,
            '" target="_blank">',
            '<img src=http://images.weserv.nl/?url=',
            url.replace(/.*?:\/\//g, ""),
            '&h=150',
            '>',
            '</a>'
          ].join(''));
      },
      postVideoFromGoogle: function(q) {
        var json = HTTP.get(
            'https://ajax.googleapis.com/ajax/services/search/video', {
              params: {
                v: '1.0',
                hl: 'ru',
                q: q
              }
            }).data;
        var url = json.responseData.results[0] &&
            json.responseData.results[0].playUrl;
        messagePostViaServer([
            '<iframe src="',
            url,
            '"></iframe>'
          ].join(''));
      }
    });
  });
}
