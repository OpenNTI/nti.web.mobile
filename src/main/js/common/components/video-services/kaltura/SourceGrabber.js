'use strict';
/**
 * Stand alone source grabber.
 * grabbed from http://player.kaltura.com/kWidget/kWidget.getSources.js
 */

var Promise = global.Promise || require('es6-promise').Promise;
var Utils = require('common/Utils');
var getService = Utils.getService;
var toQueryString = Utils.toQueryString;

function kalturaSig(str) {
	var hash = 0;
	if (str.length == 0) return hash;
	for (var i = 0; i < str.length; i++) {
		var currentChar = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + currentChar;
		hash = hash & hash;
	}
	return hash;
}


function parseResult( result ) { // API result

	var asset;
	//var ks = sourceApi.ks;
	var ipadAdaptiveFlavors = [];
	var iphoneAdaptiveFlavors = [];
	var deviceSources = [];
	var protocol = location.protocol.substr(0, location.protocol.length-1);
	// Set the service url based on protocol type
	var serviceUrl = '://cdnbakmi.kaltura.com';

	var contextData = result[1];
	var entryInfo = result[2];



	if( protocol == 'https' ){
		serviceUrl = '://www.kaltura.com';
	}

	var objectType = contextData.objectType;
	var code = contextData.code;

	var baseUrl = protocol + serviceUrl + '/p/' + entryInfo.partnerId +
			'/sp/' + entryInfo.partnerId + '00/playManifest';

	for( var i in contextData.flavorAssets ){
		asset = contextData.flavorAssets[i];
		// Continue if clip is not ready (2)
		if( asset.status !== 2  ) {
			continue;
		}
		// Setup a source object:
		var source = {
			'data-bitrate' : asset.bitrate * 8,
			'data-width' : asset.width,
			'data-height' : asset.height
		};


		var src  = baseUrl + '/entryId/' + asset.entryId;
		// Check if Apple http streaming is enabled and the tags include applembr ( single stream HLS )
		if( asset.tags.indexOf('applembr') !== -1 ) {
			src += '/format/applehttp/protocol/'+ protocol + '/a.m3u8';

			deviceSources.push({
				'flavorid' : 'AppleMBR',
				'type' : 'application/vnd.apple.mpegurl',
				'src' : src
			});

			continue;
		} else {
			src += '/flavorId/' + asset.id + '/format/url/protocol/' + protocol;
		}

		// add the file extension:
		if( asset.tags.toLowerCase().indexOf('ipad') !== -1 ){
			source.src = src + '/a.mp4';
			source.flavorid = 'iPad';
			source.type = 'video/h264';
		}

		// Check for iPhone src
		if( asset.tags.toLowerCase().indexOf('iphone') !== -1 ){
			source.src = src + '/a.mp4';
			source.flavorid = 'iPhone';
			source.type = 'video/h264';
		}
		// Check for ogg source
		if( asset.fileExt &&
			(
				asset.fileExt.toLowerCase() == 'ogg' ||
				asset.fileExt.toLowerCase() == 'ogv' ||
				( asset.containerFormat && asset.containerFormat.toLowerCase() == 'ogg' )
			)
		){
			source.src = src + '/a.ogg';
			source.flavorid = 'ogg';
			source.type = 'video/ogg';
		}

		// Check for webm source
		if( asset.fileExt == 'webm' ||
			asset.tags.indexOf('webm') !== -1 || // Kaltura transcodes give: 'matroska'
			( asset.containerFormat && asset.containerFormat.toLowerCase() == 'matroska' ) || // some ingestion systems give "webm"
			( asset.containerFormat && asset.containerFormat.toLowerCase() == 'webm' )
		){
			source.src = src + '/a.webm';
			source.flavorid = 'webm';
			source.type = 'video/webm';
		}

		// Check for 3gp source
		if( asset.fileExt == '3gp' ){
			source.src = src + '/a.3gp';
			source.flavorid = '3gp';
			source.type = 'video/3gp';
		}

		// Add the device sources
		if( source.src ){
			deviceSources.push( source );
		}

		// Check for adaptive compatible flavor:
		if( asset.tags.toLowerCase().indexOf('ipadnew') !== -1 ){
			ipadAdaptiveFlavors.push( asset.id );
		}
		if( asset.tags.toLowerCase().indexOf('iphonenew') !== -1 ){
			iphoneAdaptiveFlavors.push( asset.id );
		}

	}
	// Add the flavor list adaptive style urls ( multiple flavor HLS ):
	// Create iPad flavor for Akamai HTTP
	if( ipadAdaptiveFlavors.length !== 0 ) {
		deviceSources.push({
			flavorid: 'iPadNew',
			type: 'application/vnd.apple.mpegurl',
			src: baseUrl + '/entryId/' + asset.entryId + '/flavorIds/' + ipadAdaptiveFlavors.join(',')  + '/format/applehttp/protocol/' + protocol + '/a.m3u8'
		});
	}
	// Create iPhone flavor for Akamai HTTP
	if(iphoneAdaptiveFlavors.length !== 0 ) {
		deviceSources.push({
			flavorid: 'iPhoneNew',
			type: 'application/vnd.apple.mpegurl',
			src: baseUrl + '/entryId/' + asset.entryId + '/flavorIds/' + iphoneAdaptiveFlavors.join(',')  + '/format/applehttp/protocol/' + protocol + '/a.m3u8'
		});
	}


	return {
			objectType: objectType,
			code: code,
			poster: entryInfo.thumbnailUrl,
			duration: entryInfo.duration,
			name: entryInfo.name,
			entryId :  entryInfo.id,
			description: entryInfo.description,
			sources: deviceSources
	};
}


module.exports = function getSources(settings) {

	var param = {
		service: 'multirequest',
		apiVersion: '3.1',
		expiry: '86400',
		clientTag: 'kwidget:v2.18',
		format: 9,
		ignoreNull: 1,
		action: 'null',

		'1:service': 'session',
		'1:action': 'startWidgetSession',
		'1:widgetId': '_' + settings.partnerId,

		'2:ks': '{1:result:ks}',
		'2:contextDataParams:referrer': document.URL,
		'2:contextDataParams:objectType': 'KalturaEntryContextDataParams',
		'2:contextDataParams:flavorTags': 'all',
		'2:service': 'baseentry',
		'2:entryId': settings.entryId,
		'2:action': 'getContextData',

		'3:ks': '{1:result:ks}',
		'3:service': 'baseentry',
		'3:action': 'get',
		'3:version': '-1',
		'3:entryId': settings.entryId
	};

	//Do not alter these three lines
	param.kalsig = kalturaSig(toQueryString(param));
	param.format = 1;
	delete param.service;

	var url = 'https://cdnapisec.kaltura.com/api_v3/index.php?service=multirequest&' + toQueryString(param);

	return getService()
		.then(function(srv){return srv.get({url:url, headers: null});})
		.then(parseResult);
};
