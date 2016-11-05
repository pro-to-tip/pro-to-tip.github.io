'use strict';

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// AngularJS Chat Configuration
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
angular.module('chat').constant( 'config', {
    "pubnub": {
        "publish-key": "pub-c-36b5b922-6104-479c-ba0f-23c52a96dca1",
        "subscribe-key": "sub-c-f582e672-345d-11e6-991f-02ee2ddab7fe"
    }
} );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Chat App Module
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var basicChat = angular.module( 'BasicChat', ['chat'] );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Chat App Controller
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
basicChat.controller( 'BasicController', [ 'Messages', function( Messages ) {

    // Self Object
    var chat = this;

    // Sent Indicator
    chat.status = "";

    // Keep an Array of Messages
    chat.messages = [];

    // Set User Data
    Messages.user({ name : sillyname() });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Get Received Messages and Add it to Messages Array.
    // This will automatically update the view.
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    var chatmessages = document.querySelector(".chat-messages");
    Messages.receive(function(msg){
        chat.messages.push(msg);
        setTimeout( function() {
            chatmessages.scrollTop = chatmessages.scrollHeight;
        }, 10 );
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Send Messages
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    chat.send = function() {
        Messages.send({ data : chat.textbox });
        chat.status = "sending";
        chat.textbox = "";
        setTimeout( function() { chat.status = "" }, 1200 );
    };

} ] );
