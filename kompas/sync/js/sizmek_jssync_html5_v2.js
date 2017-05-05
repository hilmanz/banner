// ********************************************************
//   This class is part of the  Sizmek JS Sync HTML5 Block 
//   ALL RIGHTS RESERVED TO © 2014 Sizmek, Inc.
// ********************************************************
// ********************************************************

// Grab Ad ID
var ebAdID = window.ebAdID || 0;
// Grab Rand ID
var ebRand = window.ebRand || 0;
// Create New ID
var ebUID = ebAdID + "_" + ebRand;

// Create Object to hold script
window['ebCustomScript_' + ebUID] = new EBCustomScript(ebAdID, ebRand, ebUID);

// Set up script
function EBCustomScript(adid, rnd, uid) {
    // Create a reference to script
    var script = this;
    // Create Var to track Number of Ads in Campaign
    var totalSyncedAds = 0;
    // Create Array for Ads
    var si_adStorage = new Array(10);
    // Create IE9 Reference to handle IE
    var IE9 = navigator.userAgent.match(/msie 9/i) != null;
    
    
    // Create Sync Listener
    script.setUpListener = function () {
        // Add Event Listener to window
        window.addEventListener("message", function (event) {
            // Create Object to hold data from JSON object
            var obj = JSON.parse(event.data);
            // Check to see if event is a Sync Ad loaded Message 
            if (obj.type == "si_sync_block_loaded" && obj.data.syncedAdId) {
                // Loop through Ad Array
                for (var i = 0; i < si_adStorage.length; i++) {
                    // Target empty property
                    if (si_adStorage[i] != undefined) {
                        // Store Ad ID
                        if (si_adStorage[i].ebAdId == obj.data.ebAdId) { return; };
                    }
                }
                // Store Message data
                si_adStorage[obj.data.syncedAdId - 1] = obj.data;
                // Keep track on how many ads load
                totalSyncedAds++;
                // Once total Number of Sync Ads has loaded send connected message
                if (totalSyncedAds == obj.data.totalSyncedAds) {
                	// Set Array length equal to Ad length
                    si_adStorage.length = obj.data.totalSyncedAds;
                    // Loop through Ad Array
                    for (var i = 0; i < si_adStorage.length; i++) {
                    	// Create Reference to divs on page
                        var _div = document.getElementsByTagName("div");
                        // Loop through divs
                        for (var j = 0; j < _div.length; j++) {
                            // Check for divs with IDs
                            if (_div[j].id) {
                            	// If Div is one of the Ad divs
                                if (_div[j].id.indexOf("ebBannerDiv_" + si_adStorage[i].ebAdId) != -1) {
                                    // Save Reference to Placement Div
                                    si_adStorage[i].placementDiv = _div[j].parentNode;
                                    // Save Reference to Placement iFrame 
                                    si_adStorage[i].placementFrame = _div[j].getElementsByTagName("iframe")[0];
                                }
                            }
                        }
                    }
                }
                // Sync Ads are established, send connection status message
                script.connectMessage();
            // Check to see if event is a Sync Ad Action Message 
            } else if (obj.type == "si_sync_block_action") {
            	// Handle Sync Action Method
                script.sendMessage(obj);
            }

        }, false);

    }
    
    // Handle IE9 JSON issue
    script.objToString = function (_obj) {
	    var str = '';
	    for (var p in _obj) {
	        if (_obj.hasOwnProperty(p)) {
	            str += '"' + p + '":"' + _obj[p] + '",';
	        }
	    }
	    
	    str = str.substr(0, str.length-1);
	    
	    return '{' + str + '}';
	}

    // Handle Sync Connection Status Message 
    script.connectMessage = function () {
    	// Create Message String
        var msg = IE9 ? '{"type":"si_sync_block_status", "data":{ "text":"connected"}}' : JSON.stringify({ type: "si_sync_block_status", data: { text: 'connected' }});
        
        
        // Loop through Ad Array
        for (var i = 0; i < si_adStorage.length; i++) {
        	// Send Message
            try { si_adStorage[i].placementFrame.contentWindow.postMessage(msg, ebO.adConfig.protocol + ebO.adConfig.bsPath.replace("bs", "ds")); } catch (err) {};
        }
    }

    // Handle Sending Sync Message 
    script.sendMessage = function (_obj) {
    	
    	var data = script.objToString(_obj.data);
    	
    	// Create Message String
        var msg = IE9 ? '{"type":"' + _obj.type + '", "data":' + data + '}' : JSON.stringify({type: _obj.type, data: _obj.data });
        // Loop through Ad Array        
        for (var i = 0; i < si_adStorage.length; i++) {
        	 // Look for target Ad
        	if ( _obj.data.targetId == si_adStorage[i].syncedAdId ) {
				// Send Message to target Ad
				si_adStorage[i].placementFrame.contentWindow.postMessage(msg, ebO.adConfig.protocol + ebO.adConfig.bsPath.replace("bs", "ds"));
        	}
        }
    }

    // Call init
    script.setUpListener();

}