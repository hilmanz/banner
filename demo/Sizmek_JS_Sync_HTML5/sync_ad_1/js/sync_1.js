// ********************************************************
//   This class is part of the  Sizmek JS Sync HTML5 Block 
//   ALL RIGHTS RESERVED TO © 2014 Sizmek, Inc.
// ********************************************************
// ********************************************************

// Create Object to hold Global Vars 
var si_sync_block = {};

// Handle body onLoad 
function loadEB() {
	// Listen for EB object, if ready, proceed with script
	if (EB.isInitialized()) { init(); } else { EB.addEventListener(EBG.EventName.EB_INITIALIZED, init); };
}

// Handle Ad Set up
function init() {
    // Establish Ad ID
    var adId = EB._adConfig.adId;

    // Listen for ad load before moving forward
	window.addEventListener("message", function (event) {
	    // Establish data from JSON object
	    var obj = JSON.parse(event.data);
	    // If EB Object exists, proceed 
	    try { if (obj.type != null) { handleMessage(obj); }; } catch (err) {};
	});

    // Use EB._sendMessage to send Type And Data to establish Connection
    // Type: si_sync_block_loaded
    // Data: Object with three properties
    // ebAdId: send Ad ID from delivery Object 
    // totalSyncAds: Total Number of Sync Ads in Campaign
    // syncedAdId: ID number of this Sync Ad 

    // Send loaded message to Sync Script
    EB._sendMessage('si_sync_block_loaded', {
        ebAdId: adId,
        totalSyncedAds: 2,
        syncedAdId: 1
    });

    // Create Reference to Status Text Div
    si_sync_block.c_div = document.getElementById('connect_text');
    // Create Reference to Color Button 1
    si_sync_block.btn_1 = document.getElementById('color_block_1');
    // Create Reference to Color Button 1
    si_sync_block.btn_2 = document.getElementById('color_block_2');
    // Create Reference to Color Button 1
    si_sync_block.btn_3 = document.getElementById('color_block_3');
    // Create Reference to Clickthrough Button 1
    si_sync_block.clickthrough = document.getElementById('clickthrough');

    // Listen for Click
    si_sync_block.clickthrough.onclick = function () {
        // Check if working locally, if not, call EB.Clickthrough Method 
         if (!EB._isLocalMode) { EB.clickthrough('sync_ad_2', self.click); } else { window.open(self.click, '_blank'); };
    }

    // Use EB._sendMessage to send Type And Data
    // Type: si_sync_block_action
    // Data: Object with two properties
    // targetID: send Sync Ad ID of the Sync Ad you wish to target 
    // methodName: string of the method name you wish to call 

    // Listen for Click
    si_sync_block.btn_1.onclick = function () {
        EB._sendMessage('si_sync_block_action', {
            targetId: 2,
            methodName: 'colorChange_1'
        });
    }

    // Listen for Click
    si_sync_block.btn_2.onclick = function () {
        EB._sendMessage('si_sync_block_action', {
            targetId: 2,
            methodName: 'colorChange_2'
        });
    }

    // Listen for Click
    si_sync_block.btn_3.onclick = function () {
        EB._sendMessage('si_sync_block_action', {
            targetId: 2,
            methodName: 'colorChange_3'
        });
    }
}

// Handle Messages from Listener
function handleMessage(_obj) {
    // Listen for Connection Status
    if (_obj.type === 'si_sync_block_status') {
        // Display Connection Status
        statusText();
        // Listen for Sync Action
    } else if (_obj.type === 'si_sync_block_action') {
        // Call Method that is passed through Sync Action Message
        window[_obj.data.methodName](_obj);
    }
}

// Set up Methods that will be called by Sync Script

// Handle Connection Status Display
function statusText() {
    // Update Connection Status Display
    si_sync_block.c_div.innerHTML = 'Ad 1: Connected';
}