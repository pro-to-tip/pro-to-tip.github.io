'use strict';

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// AngularJS Chat Configuration
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
angular.module('chat').constant( 'config', {
    //
    // Get your API Keys -> https://admin.pubnub.com/#/register
    //
    "pubnub": {
        "publish-key"   : "pub-c-f8fa55c1-1a09-4d68-a30c-56a647bac7f4",
        "subscribe-key" : "sub-c-eaa4ff58-a2d8-11e6-81d1-0619f8945a4f"
    }
} );
