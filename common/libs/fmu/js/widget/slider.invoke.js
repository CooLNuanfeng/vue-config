/**
* ./slider.js
 */

 FMU.UI.sliderInvoke = function(container, options) {
 	if (!container) return;

    if ($(container).find(".J_fmu_slider_item").length <= 1) return;
    
    return new FMU.UI.Slider(container, options);
}
