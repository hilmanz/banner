var adDiv;
var bannerDiv;
var expansionDiv;
var videoContainer;
var video;
var sdkVideoPlayer;
var sdkVideoPlayButton;
var closeButton;
var isAndroid2 = (/android 2/i).test(navigator.userAgent);
var windowsPhone = (/windows phone/i).test(navigator.userAgent);
var android2ResizeTimeout;

function initEB()
{
	if (!EB.isInitialized())
	{
		EB.addEventListener(EBG.EventName.EB_INITIALIZED, startAd);
	}
	else
	{
		startAd();
	}
}

function startAd()
{
	adDiv = document.getElementById("ad");
	bannerDiv = document.getElementById("banner");
	expansionDiv = document.getElementById("expansion");
	videoContainer = document.getElementById("videoContainer");
	video = document.getElementById("video");
	sdkVideoPlayer = document.getElementById("sdkVideoPlayer");
	sdkVideoPlayButton = document.getElementById("sdkVideoPlayButton");
	closeButton = document.getElementById("closeButton");

	var sdkData = EB.getSDKData();
	var enableSDKDefaultCloseButton = EB._adConfig && EB._adConfig.hasOwnProperty("mdEnableSDKDefaultCloseButton") && EB._adConfig.mdEnableSDKDefaultCloseButton;
	if (sdkData !== null)
	{
		if (sdkData.SDKType === "MRAID" && !enableSDKDefaultCloseButton)
		{
			// set sdk to use custom close button
			EB.setExpandProperties({useCustomClose: true});
		}
	}
	
	window.addEventListener("message", onMessageReceived);
	initVideo();
	updateSize();
	if (sdkData === null || !enableSDKDefaultCloseButton)
	{
		closeButton.style.display = "block";
	}		
	bannerDiv.style.visibility = "visible";
}

function expand()
{
	EB.expand();
	preventPageScrolling();
	expansionDiv.style.visibility = "visible";
	removeClass(adDiv, "collapsed");
	setClass(adDiv, "expanded");
	videoContainer.style.display = "block";
	if (video)
	{
        video.play();
		video.style.display = "block";
	}
}

function collapse()
{
	expansionDiv.style.visibility = "hidden";
	removeClass(adDiv, "expanded");
	setClass(adDiv, "collapsed");
	if (video)
	{
		video.pause();
		video.style.display = "none";
	}
	videoContainer.style.display = "none";
	EB.collapse();
	allowPageScrolling();
}

function initVideo()
{
	var sdkData = EB.getSDKData();
	var useSDKVideoPlayer = false;
	var sdkPlayerVideoFormat = EB._adConfig && EB._adConfig.hasOwnProperty("mdSDKVideoFormat") ? EB._adConfig.mdSDKVideoFormat : "mp4";
	var enableSDKVideoPlayer = EB._adConfig && EB._adConfig.hasOwnProperty("mdEnableSDKVideoPlayer") && EB._adConfig.mdEnableSDKVideoPlayer;
	if (sdkData !== null) {
		if (sdkData.SDKType === "MRAID" && sdkData.version > 1 && enableSDKVideoPlayer)
		{
			var sourceTags = video.getElementsByTagName("source");
			var videoSource = "";
			for (var i = 0 ; i < sourceTags.length; i ++)
			{
				if (sourceTags[i].getAttribute("type"))
				{
					if (sourceTags[i].getAttribute("type").toLowerCase() === "video/" + sdkPlayerVideoFormat)
					{
						videoSource = sourceTags[i].getAttribute("src");
					}
				}
			}
			videoContainer.removeChild(video);
			video = null;
			sdkVideoPlayButton.addEventListener("click", function()
			{
				if (videoSource !== "")
				{
					EB.playVideoOnNativePlayer(videoSource);
				}
			});
			useSDKVideoPlayer = true;
		}
	}
	if (!useSDKVideoPlayer)
	{
		videoContainer.removeChild(sdkVideoPlayer);
		video.addEventListener("touchstart", allowPageScrolling);
		video.addEventListener("touchend", preventPageScrolling);
		var videoTrackingModule = new EBG.VideoModule(video);
		if (windowsPhone)
		{
			video.addEventListener("click", function(event)
			{
				var videoWidth = getCurrentStyle(this, "width");
				var videoHeight = getCurrentStyle(this, "height");
				if(videoWidth < 168 || videoHeight < 152)
				{
					video.play();
				}
			}, false);			
		}
	}
	videoContainer.style.visibility = "visible";
}

function handleExpandButtonClick()
{
	expand();
}

function handleCloseButtonClick()
{
	collapse();
}

function handleClickthroughButtonClick()
{
	if (video)
	{
		video.pause();
	}
	EB.clickthrough();
    console.log('click');
}

function handleUserActionButtonClick()
{
	EB.userActionCounter("CustomInteraction");
}

function preventPageScrolling()
{
	document.addEventListener("touchmove", preventDefault);
}

function allowPageScrolling()
{
	document.removeEventListener("touchmove", preventDefault);
}

function preventDefault(event)
{
	event.preventDefault();
}

function onMessageReceived(event)
{
	var messageData = JSON.parse(event.data);
	if (messageData.adId && messageData.adId === getAdID())
	{
		if (messageData.type && messageData.type === "resize")
		{
			if (isAndroid2)
			{
				forceResizeOnAndroid2();
			}
		}
	}
}

function getAdID()
{
	if (EB._isLocalMode)
	{
		return null;
	}
	else
	{
		return EB._adConfig.adId;
	}
}

function forceResizeOnAndroid2()
{
	document.body.style.opacity = 0.99
	clearTimeout(android2ResizeTimeout);
	android2ResizeTimeout = setTimeout(function()
	{
		document.body.style.opacity = 1;
		document.body.style.height = window.innerHeight;
		document.body.style.width = window.innerWidth;
	}, 200);
}

function getCurrentStyle(_e, _s)
{
	var _v = null;
	if (typeof window.getComputedStyle !== "undefined")
	{
		_v = parseInt(window.getComputedStyle(_e).getPropertyValue(_s),10);
	}
	else
	{
		_v = parseInt(_e.currentStyle[_s],10);
	}
	return _v;
}	

function setClass(e, c)
{
	var cc = null;
	if (typeof e.className === "undefined")
	{
		cc = e.getAttribute("class");
		if (cc.indexOf(c) < 0)
		{
			if (c.length > 0)
			{
				c = cc + " " + c;
			}
			e.setAttribute("class", c);
		}
	}
	else
	{
		cc = e.className;
		if (cc.indexOf(c) < 0)
		{
			if (c.length > 0)
			{
				c = cc + " " + c;
			}
			e.className = c;
		}
	}
}

function removeClass(e, c)
{
	var nc = null;
	var reg = new RegExp('(\\s|^)+'+c.replace("-","\\-")+'(\\s|$)+');
	if (typeof e.className === "undefined")
	{
		nc = e.getAttribute("class").replace(reg, ' ');
		e.setAttribute("class", nc);
	}
	else
	{
		e.className = e.className.replace(reg, ' ');
	}
}

function updateLabel()
{
	var bannerSize = (EB._adConfig && EB._adConfig.hasOwnProperty("mdBannerSizeInheritance") && EB._adConfig.mdBannerSizeInheritance === "" ? "" : window.innerWidth) + " x " + window.innerHeight + "";
	document.getElementById("banner").childNodes[1].innerHTML = "";
}

function updateSize()
{
	bannerDiv.style.width = (window.innerWidth - 2) + "px";
	bannerDiv.style.height = (window.innerHeight - 2) + "px";
	updateLabel();
}

window.addEventListener("resize", updateSize, false);