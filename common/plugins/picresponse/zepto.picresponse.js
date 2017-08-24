// required include
// common/libs/gmu-v2/js/extend/matchMedia.min.js

// how to use
/*
<picture>
	<source srcset="sample.jpg"></source>
	<source srcset="samplex2.jpg" media="only screen and (-webkit-min-device-pixel-ratio: 2.0)"></source>
	<source srcset="samplex3.jpg" media="only screen and (-webkit-min-device-pixel-ratio: 3.0)"></source>
	<img src="http://static2.51fanli.net/common/images/loading/spacer.png"/>
</picture>
*/

/*! Modifyed from Picturefill - Responsive Images that work today. (and mimic the proposed Picture element with span elements). Author: Scott Jehl, Filament Group, 2012 | License: MIT/GPLv2 */

(function( w, $ ){

	// Enable strict mode
	"use strict";

	w.picturefill = function() {
		var ps = w.document.getElementsByTagName( "picture" );

		// Loop the pictures
		for( var i = 0, il = ps.length; i < il; i++ ){
			if( true || ps[ i ].getAttribute( "data-picture" ) !== null ){

				var sources = ps[ i ].getElementsByTagName( "source" ),
					matches = [];

				// See if which sources match
				for( var j = 0, jl = sources.length; j < jl; j++ ){
					var media = sources[ j ].getAttribute( "media" );
					// if there's no media specified, OR $.matchMedia is supported 
					if( !media || ( $.matchMedia && $.matchMedia( media ).matches ) ){
						matches.push( sources[ j ] );
					}
				}

			// Find any existing img element in the picture element
				var picImg = ps[ i ].getElementsByTagName( "img" )[ 0 ];
				var $picImg = $(picImg);

				if( matches.length ){
					var matchedEl = matches.pop();
					if( !picImg ){
						picImg = w.document.createElement( "img" );
						// picImg.alt = ps[ i ].getAttribute( "alt" );
					}
					else if( matchedEl === picImg.parentNode ){
						// Skip further actions if the correct image is already in place
						continue;
					}
					// $picImg.attr('data-url',matchedEl.getAttribute( "srcset" ));
					picImg.src =  matchedEl.getAttribute( "srcset" );
					matchedEl.appendChild( picImg );
					// to do:add img lazyload
					// $picImg.imglazyload();
				}
				else if( picImg ){
					picImg.parentNode.removeChild( picImg );
				}
			}
		}
	};

	// Run on resize and domready (w.load as a fallback)
	if( w.addEventListener ){
		w.addEventListener( "resize", w.picturefill, false );
		w.addEventListener( "DOMContentLoaded", function(){
			w.picturefill();
			// Run once only
			w.removeEventListener( "load", w.picturefill, false );
		}, false );
		w.addEventListener( "load", w.picturefill, false );
	}
	else if( w.attachEvent ){
		w.attachEvent( "onload", w.picturefill );
	}

}( this, Zepto));
