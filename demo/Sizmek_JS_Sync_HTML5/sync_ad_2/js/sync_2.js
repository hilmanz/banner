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
        syncedAdId: 2
    });

    // Establish Reference to Color Block Div
    si_sync_block.b_div = document.getElementById('color_block');
    // Establish Reference to Connect Text Div
    si_sync_block.c_div = document.getElementById('connect_text');
    // Establish Reference to Color Text Div
    si_sync_block.t_div = document.getElementById('color_text');
    // Create Reference to Clickthrough Button 1
    si_sync_block.clickthrough = document.getElementById('clickthrough');

    // Listen for Click
    si_sync_block.clickthrough.onclick = function () {
        // Check if working locally, if not, call EB.Clickthrough Method 
        if (!EB._isLocalMode) { EB.clickthrough('sync_ad_2', self.click); } else { window.open(self.click, '_blank'); };
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
    si_sync_block.c_div.innerHTML = 'Ad 2: Connected';
}

// Handle Button 1 Color Change
function colorChange_1() {
    // Update style to color text field
    si_sync_block.t_div.style.color = "#0d9884";
     // Update text to the color text field
    si_sync_block.t_div.innerHTML = '0d9884';
    // Update style to color block
    si_sync_block.b_div.style.backgroundColor = "#0d9884";
}

// Handle Button 2 Color Change
function colorChange_2() {
    // Update style to color text field
    si_sync_block.t_div.style.color = "#00d1c6";
    // Update text to the color text field
    si_sync_block.t_div.innerHTML = '00d1c6';
    // Update style to color block
    si_sync_block.b_div.style.backgroundColor = "#00d1c6";
}

// Handle Button 3 Color Change
function colorChange_3(_obj) {
    // Update style to color text field
    si_sync_block.t_div.style.color = "#1e79b6";
    // Update text to the color text field
    si_sync_block.t_div.innerHTML = '1e79b6';
    // Update style to color block
    si_sync_block.b_div.style.backgroundColor = "#1e79b6";
}