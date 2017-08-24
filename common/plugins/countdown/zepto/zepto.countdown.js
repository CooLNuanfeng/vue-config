/**
 * Zepto countdown plugin v0.1
 * 
 * HTML:
	<div id="J-countDown" data-remain="1200">
		<span class="J-Day"></span> 天
		<span class="J-Hour"></span> 时
		<span class="J-Minute"></span> 分
		<span class="J-Second"></span> 秒
	</div>

 * JS:
	$('#J-countDown').countdown({
		type: 'all'
	});
**/

;(function($){
	$.fn.countdown = function(config){
		return this.each(function(){
			Countdown(this, config);
		});
	};

	function Countdown(elem, config){

		var settings = {
			output: '.J-CountDown',
			type: 'all', //all, day, hour, minute, second
			day: '.J-Day',
			hour: '.J-Hour',
			minute: '.J-Minute',
			second: '.J-Second',
			coke: false,
			onExpiry:null
		};

		if(!(this instanceof Countdown)){
			return new Countdown(elem, config);
		}

		this.config = $.extend(settings, config);
		this.$elem = $(elem);
		this.init();
	}

	$.extend(Countdown.prototype, {
		init: function(){
			var $output = this.$elem;
			var remain = parseInt($output.data('remain'), 10);
			var that = this;
			
			if($output.size() === 0 || !remain){
				return;
			}
			this.remain = remain;
			this.interval = window.setInterval(function(){
				that.start();
			}, 1000);
		},

		start: function(){
			if(this.remain < 0){
				this.stop();
				return;
			}
			this.get();
			this.remain--;
		},

		pause: function(){
			if(this.interval){
				clearInterval(this.interval);
			}
		},

		stop: function(){
			this.pause();
			this.remain = -1;
			if(typeof this.config.onExpiry == 'function'){
				this.config.onExpiry();
			}
		},

		reset: function(){
			this.pause();
			this.remain = $(this.config.output).data('remain');
		},

		get: function(){
			switch(this.config.type){
			case 'all':
				$(this.config.output).html(this.getAll());
				break;
			case 'day':
				$(this.config.day, this.$elem).html(this.getDay());
				break;
			case 'hour':
				$(this.config.hour, this.$elem).html(this.getHour());
				break;
			case 'minute':
				$(this.config.minute, this.$elem).html(this.getMinute());
				break;
			case 'second':
				$(this.config.second, this.$elem).html(this.getSecond());
				break;
			default :
				this.getAll();
				break;
			}
		},

		getAll: function(){
			if(!this.config.coke){
				$(this.config.day, this.$elem).html(this.getDay());
				$(this.config.hour, this.$elem).html(this.getHour());
			}
			else{
				$(this.config.hour, this.$elem).html(this.fillZero(parseInt(this.getDay()) * 24 + parseInt(this.getHour()),2));				
			}
			$(this.config.minute, this.$elem).html(this.getMinute());
			$(this.config.second, this.$elem).html(this.getSecond());
		},

		getDay: function(){
			var day = parseInt(this.remain / 86400, 10);
			return day !== 0 ? day : 0;
		},

		getHour: function(){
			var hour = parseInt((this.remain % 86400) / 3600, 10);
			if(this.config.type && this.config.type === 'hour'){
				hour = parseInt(this.getDay() * 24 + (this.remain % 86400) / 3600, 10);
			}
			else{
				hour = this.fillZero(hour, 2);
			}
			return hour;
		},

		getMinute: function(){
			var minute = parseInt((this.remain % 3600) / 60, 10);
			if(this.config.type && this.config.type === 'minute'){
				minute = parseInt(this.getDay() * 24 * 60 +
					this.getHour() * 60 + (this.remain % 3600) / 60, 10);
			}
			else{
				minute = this.fillZero(minute, 2);
			}

			return minute;
		},

		getSecond: function(){
			var second = this.remain % 60;
			if(this.config.type && this.config.type === 'second'){
				second = this.getDay() * 24 * 60 * 60 +
					this.getHour() * 60 * 60 +
					this.getMinute() * 60 +
					this.remain % 60;
			}
			else{
				second = this.fillZero(second, 2);
			}
			return second;
		},

		fillZero: function(num, digit){
			var str = '' + num;
			while(str.length < digit){
				str = '0' + str;
			}
			return str;
		}
	});
})(Zepto);