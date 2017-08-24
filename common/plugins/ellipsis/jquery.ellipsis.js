/**
 * jQuery ellipsis plugin v0.1
 * zhe.fu@fanli.com
 * 
 * CSS setting
 * .ellipsis{width:200px;}
 * 
 * if inline element, such as <a>:
 * a.ellipsis{display:inline-block; *display:inline; *zoom:1;}
**/

;(function($){
	$.fn.ellipsis = function(){
		return this.each(function(){
			var $this = $(this),
				text = $this.text(),
				style = document.documentElement.style;
			
			$this.css({
				'white-space': 'nowrap',
				'overflow': 'hidden'
			});
			
			if('textOverflow' in style || 'OTextOverflow' in style){
				
	            $this.css({
	                'text-overflow': 'ellipsis',
	                '-o-text-overflow': 'ellipsis'
	            });
	        }
			else{
				var width = $this.width(),
					$clone = $this.clone().insertAfter($this),
					a = 0,
					b = text.length,
					c = b;				
				
				$clone.text(text).css({
					'position': 'absolute',
					'width': 'auto',
					'visibility': 'hidden',
					'overflow': 'hidden'
				});
				
				if($clone.width() > width){
					while ((c = Math.floor((b + a) / 2)) > a){
	                    $clone.text(text.substr(0, c) + '…');
	                    if($clone.width() > width){
							b = c;
						}
	                    else{
							a = c;
						}
	                }
	                $this.text(text.substr(0, c) + '…');
	                
				}
				$clone.remove();
			}
			//set title
			if(!$this.attr('title')){
				$this.attr('title', text);
			}
		});
	}
})(jQuery)
