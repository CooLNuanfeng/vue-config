/**
 * jQuery :  城市联动插件
 * @author   chao.ming@fanli.com
 * @example  $("#test").ProvinceCity();
 * @import   include "provincesdata.js"
 * @params   暂无
 */

///<reference path="provincesdata.js" />

$.fn.citySelect = function ()
{
	var _self = this;
	var GP = Fanli.Province.Data.GP();
	var GT = Fanli.Province.Data.GT();
	var GC = Fanli.Province.Data.GC();

	//定义3个默认值
	_self.data("province", ["请选择省份", "请选择"]);
	_self.data("city1", ["请选择城市", "请选择"]);
	_self.data("city2", ["请选择地区", "请选择"]);

	//插入3个空的下拉框
	_self.append("<select id='J_select_province' name='province'></select>");
	_self.append("<select id='J_select_city' name='city'></select>");
	_self.append("<select id='J_select_district' name='district'></select>");

	//分别获取3个下拉框
	var $sel1 = $("#J_select_province");
	var $sel2 = $("#J_select_city");
	var $sel3 = $("#J_select_district");

	//默认省级下拉
	if (_self.data("province"))
	{
		$sel1.append("<option value='" + _self.data("province")[1] + "'>" + _self.data("province")[0] + "</option>");
	}

	$.each(GP, function (index, data)
	{
		$sel1.append("<option value='" + data + "'>" + data + "</option>");
	});

	//默认的1级城市下拉
	if (_self.data("city1"))
	{
		$sel2.append("<option value='" + _self.data("city1")[1] + "'>" + _self.data("city1")[0] + "</option>");
	}

	//默认的2级城市下拉
	if (_self.data("city2"))
	{
		$sel3.append("<option value='" + _self.data("city2")[1] + "'>" + _self.data("city2")[0] + "</option>");
	}

	//省级联动 控制
	var index1 = "";

	$sel1.change(function ()
	{
		//清空其它2个下拉框
		$sel2[0].options.length = 0;
		$sel3[0].options.length = 0;
		index1 = this.selectedIndex;

		if (index1 == 0)
		{
			//当选择的为 “请选择” 时
			if (_self.data("city1"))
			{
				$sel2.append("<option value='" + _self.data("city1")[1] + "'>" + _self.data("city1")[0] + "</option>");
			}
			if (_self.data("city2"))
			{
				$sel3.append("<option value='" + _self.data("city2")[1] + "'>" + _self.data("city2")[0] + "</option>");
			}
		}
		else
		{
			$.each(GT[index1 - 1], function (index, data)
			{
				$sel2.append("<option value='" + data + "'>" + data + "</option>");
			});
			$.each(GC[index1 - 1][0], function (index, data)
			{
				$sel3.append("<option value='" + data + "'>" + data + "</option>");
			})
		}
	}).change();

	//1级城市联动 控制
	var index2 = "";

	$sel2.change(function ()
	{
		$sel3[0].options.length = 0;
		index2 = this.selectedIndex;
		$.each(GC[index1 - 1][index2], function (index, data)
		{
			$sel3.append("<option value='" + data + "'>" + data + "</option>");
		})
	});

	return _self;
};