(function(a){a.widget("custom.combobox",{_create:function(){this.wrapper=a("<span>").addClass("custom-combobox").insertAfter(this.element);this.element.hide();this._createAutocomplete();this._createShowAllButton()},_createAutocomplete:function(){var b=this.element.children(":selected"),c=b.val()?b.text():"";this.input=a("<input>").appendTo(this.wrapper).val(c).attr("title","").addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left").autocomplete({delay:0,minLength:0,source:a.proxy(this,"_source")}).tooltip({tooltipClass:"ui-state-highlight"});this._on(this.input,{autocompleteselect:function(d,e){e.item.option.selected=true;this._trigger("select",d,{item:e.item.option})},autocompletechange:"_removeIfInvalid"})},_createShowAllButton:function(){var b=this.input,c=false;a("<a>").attr("tabIndex",-1).attr("title","\u663E\u793A\u6240\u6709").tooltip().appendTo(this.wrapper).button({icons:{primary:"ui-icon-triangle-1-s"},text:false}).removeClass("ui-corner-all").addClass("custom-combobox-toggle ui-corner-right").mousedown(function(){c=b.autocomplete("widget").is(":visible")}).click(function(){b.focus();if(c){return}b.autocomplete("search","")})},_source:function(c,b){var d=new RegExp(a.ui.autocomplete.escapeRegex(c.term),"i");b(this.element.children("option").map(function(){var e=a(this).text();if(this.value&&(!c.term||d.test(e))){return{label:e,value:e,option:this}}}))},_removeIfInvalid:function(d,f){if(f.item){return}var e=this.input.val(),b=e.toLowerCase(),c=false;this.element.children("option").each(function(){if(a(this).text().toLowerCase()===b){this.selected=c=true;return false}});if(c){return}this.input.val("").attr("title",e+" \u65E0\u5339\u914D\u7ED3\u679C").tooltip("open");this.element.val("");this._delay(function(){this.input.tooltip("close").attr("title","")},2500);this.input.autocomplete("instance").term=""},_destroy:function(){this.wrapper.remove();this.element.show()}})})(jQuery);