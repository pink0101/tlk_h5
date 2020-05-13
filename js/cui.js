/***
 * @class cui 1 (移动端) Javascript Library
 * @fileName: cui.js
 * @version: 1.0.0
 * @Copyright 2018-12-01 cl15095344637@163.com
 * @Introduce: jquery.min.js
 */
(function($, window, document, undefined) {
	'use strict';
	let Global;
	var cui = {
		default: function(set){
			var opts = {
				warp: null, //父元素名称(".class"或'#id')
		    	title: null,
		    	content: null,
		    	tip: null,
		    	mask: false,
		    	maskTouch: false, //遮罩层点击、拖动是否关闭弹窗
		    	btns: ["确定"],
		    	showtime: 2000,
		    	location: 'bottom',
		    	items: [],
		    	icon: null, //图标URL
		    	loading: {
		    		style: "dot" //loading加载动画风格('dot：点 组合（默认）'，'ring'：圆环)
		    	}
		    }
		    return this.extend(opts, set, true); //对象合并
		},
		/***创建+显示loading加载弹窗
		   @param {string} warp 默认null全屏、亦可指定class或id
		   @param {string} title 加载状态提示
		   @param {bool} mask 是否显示遮罩层，默认false不显示，true显示
		   @param {string} loading: {style: 'dot'} 动画风格('dot：点组合（默认）'，'ring'：圆环)
		   @example: cui.showload({target: 'body', title: '加载中...'},function(){//可不写});
		 */
		showload: function(set, callback){
			let d = this.default(set);
			if($(".cui-loading").length > 0)
   			{
   				return;
   			}
   			else
   			{
				var html =
				'<div class="cui-loading">'
					+'<div class="cui-loading-main">'
						+'<div class="cui-loading-circle">'
						+'</div>'
					+'</div>'
				+'</div>';
				this.isDefine(d.warp) ? $(d.warp).append(html) : $("body").append(html);
				for(let i = 0; i < 16; i++)
				{
					if(d.loading.style == 'dot')
					{
						$(".cui-loading .cui-loading-circle").append('<span class="loading-'+i+'"></span>');
					}
				}
				if(d.loading.style == 'ring')
				{
					$(".cui-loading .cui-loading-circle").addClass("cui-loading-ring");
					$(".cui-loading .cui-loading-ring").css({"border-top-color": $(d.warp).css("color"),"border-right-color": $(d.warp).css("color"),"border-left-color": $(d.warp).css("color")});
				}
				d.mask ? $(".cui-loading-main").before('<div class="cui-mask"></div>') : '';
				this.isDefine(d.title) ? $(".cui-loading-main").append('<div class="cui-loading-title">'+ d.title +'</div>') : '';
				//全屏loading---d.warp 未配置
   				if(!this.isDefine(d.warp))
   				{
   					$(".cui-loading").attr({class: "cui-loading cui-loading-body"});
   					if(this.isDefine(d.title))
   					{
   						if($(".cui-loading-main").width() < $(".cui-loading-main").height())
						{
							$(".cui-loading-body .cui-loading-main").css({"width": $(".cui-loading-main").height() + 20 + "px"});
						}
   					}
   					else
   					{
   			// 			$(".cui-loading-body .cui-loading-main").css({"border-radius": "50%"});
   					}
   				}
   				//指定标签内loading---父容器 $(d.warp)
   				else
   				{
   					$(".cui-loading").attr({class: "cui-loading cui-loading-div"});
   					$(d.warp).css({'position': 'relative'});
   					$(".cui-loading-div").css({"border-radius": $(d.warp).css("border-radius"),"background": $(d.warp).css("background-color")});
   					$(".cui-loading-div .cui-loading-circle").css({"width": $(d.warp).height() - 20 + "px","height": $(d.warp).height() - 20 + "px", "margin-top": ($(".cui-loading-div").height() - $(".cui-loading-circle").height() - 2) / 2 + "px"});
   					$(".cui-loading-div .cui-loading-ring").css({"width": $(d.warp).height() - 24 + "px","height": $(d.warp).height() - 24 + "px", "margin-top": ($(".cui-loading-div").height() - $(".cui-loading-ring").height()) / 2 + "px"});
   					$(".cui-loading-div .cui-loading-circle span").change().css({"border-color": $(d.warp).css("color")});
   					if($(".cui-loading-div .cui-loading-circle").width() == 20)
   					{
   						$(".cui-loading-div .cui-loading-circle span").change().css({"border-width": "4px","height": "2px"});
   					}
   					if(d.title)
   					{
						$(".cui-loading-div .cui-loading-title").css({"color": $(d.warp).css("color"), "height": $(".cui-loading-div").height() + "px", "line-height": $(".cui-loading-div .cui-loading-title").height() + 3 + "px"});
						if($(d.warp).height() > 30)
						{
							$(".cui-loading-div .cui-loading-ring").css({"margin-top": ($(".cui-loading-div").height() - $(".cui-loading-ring").height()) / 2 - 3	 + "px"});
						}
   					}
					else
					{
						if($(d.warp).height() > 30)
						{
							$(".cui-loading-div .cui-loading-ring").css({"margin-top": ($(".cui-loading-div").height() - $(".cui-loading-ring").height()) / 2 - 3	 + "px"});
						}
					}
   				}
				$(".cui-loading").on("touchstart", function(e){
				    e.preventDefault();
				});
				$(".cui-loading").on("touchmove", function(e){
				    e.preventDefault();
				});
				callback ? callback() : '';
   			}
		},
		/***关闭loading加载弹窗
   		 	@example: cui.hideload();
   		 */
		hideload: function(){
			$(".cui-loading").fadeOut(200);
			setTimeout(function(){
				$(".cui-loading").remove();
			},200);
		},
		/***创建toast仿系统底部消息弹窗
		 	@param {string} title 提示内容
		 	@param {string} icon 提示图片（location为middle时可用）
		 	@param {string} location: 位置（bottom或 middle,默认bottom）
		 	@param {number} showtime: 显示时间(默认2000ms)
		 	@example: cui.toast({title: '', location: 'bottom', showtime: 2000},function(){//可不写});
		 */
		toast: function(set, callback){
			var d = this.default(set);
			if($(".cui-toast").length > 0)
			{
				return;
			}
			else
			{
				var html = '<div class="cui-toast">'+ d.title +'</div>';
				$("body").append(html);
				$(".cui-toast").css({"left": ($("body,html").width() - $(".cui-toast").width() - 30) / 2})
				switch (d.location){
					case "middle":
						$(".cui-toast").attr({class: "cui-toast cui-toast-middle"});
						if(this.isDefine(d.icon))
						{
							$(".cui-toast").html('<img class="cui-toast-img" src="'+ d.icon +'" /><p>'+ d.title +'</p>');
						}
						break;
					default:
						$(".cui-toast").attr({class: "cui-toast cui-toast-bottom"});
						break;
				}
				var showtime = d.showtime;
				showtime > 0 ? showtime = d.showtime : showtime = 2000;
				setTimeout(function(){
					$(".cui-toast").fadeOut(200);
					setTimeout(function(){
						$(".cui-toast").remove();
						callback ? callback() : '';
					},200);
				},showtime);
			}
		},
		/***创建dialog消息弹窗
		 	@param {string} title 标题
		 	@param {string} content: 提示内容
		 	@param {bool} mask 是否显示遮罩层，默认false不显示，true显示
		 	@param {bool} maskTouch mask为true时遮罩层拖动或点击是否关闭弹窗，默认false不关闭，true关闭
		 	@param {Array} btns 底部按钮 默认['确定']  或 [{name: '按钮1', color: ''},{name: '按钮2', color: ''}]
		 	@example: cui.dialog({title: '', content: '', mask: true, btns: ['取消', '确定']},function(e){});
		 */
		dialog: function(set, callback){
			var d = this.default(set);
			if($(".cui-dialog").length > 0)
			{
				return;
			}
			else
			{
				var html =
				'<div class="cui-dialog">'
					+'<div class="cui-dialog-main">'
						+'<div class="cui-dialog-content">'+ d.content +'</div>'
						+'<div class="cui-dialog-down"></div>'
					+'</div>'
				+'</div>';
				$("body").append(html);
				d.title ? $(".cui-dialog-content").before('<div class="cui-dialog-title">'+ d.title +'</div>') : "";
				d.mask ? $(".cui-dialog-main").before('<div class="cui-mask"></div>') : "";
				for(var i in d.btns)
				{
					//不设置按钮字体样式///d.btns = ['按钮1', '按钮2']
					if(Object.prototype.toString.call(d.btns[i]) === "[object String]")
					{
						$(".cui-dialog-down").append('<span class="cui-dialog-down-btn" index="'+ i +'">'+ d.btns[i] +'</span>');
					}
					//设置按钮字体样式///d.btns = [{name: '按钮1', color: ''},{name: '按钮2', color: ''}]
					else if(Object.prototype.toString.call(d.btns[i]) === "[object Object]")
					{
						$(".cui-dialog-down").append('<span class="cui-dialog-down-btn" index="'+ i +'">'+ d.btns[i].name +'</span>');
						if(d.btns[i].color)
						{
							$(".cui-dialog-down").find(".cui-dialog-down-btn").eq(i).css({color: d.btns[i].color});
						}
					}
				}
				d.content && d.content.length < 15 ?
				d.title ? $(".cui-dialog-content").css({"text-align": "center", "padding": "20px"}) :
				$(".cui-dialog-content").css({"text-align": "center", "padding": "40px 20px 20px 20px"}) :
				d.title ? $(".cui-dialog-content").css({"text-align": "left", "padding": "10px 20px 20px 20px"}) :
				$(".cui-dialog-content").css({"text-align": "left", "padding": "30px 20px 20px 20px"});
				if(d.maskTouch)
				{
		    		$(".cui-dialog-main").on("touchmove",function(e){
		    			e.preventDefault();
		    		});
		    		$(".cui-dialog .cui-mask").on("touchmove click", function(e){
		    			$(".cui-dialog").css({"animation": "cui-fade-out .1s ease-out"});
						$(".cui-dialog .cui-dialog-main").css({'animation': 'cui-scale-out .1s ease-out'});
						setTimeout(function(){
							$(".cui-dialog").remove();
							callback ? callback({index: '-1'}) : '';
						},100);
		    		});
				}
				else
				{
					$(".cui-dialog").on("touchmove",function(e){
		    			e.preventDefault();
		    		});
				}
	    		$(".cui-dialog-down-btn").on("touchstart",function(){
	    			$(this).css({background: "#EFEFF4"});
	    		});
	    		$(".cui-dialog-down-btn").on("touchend",function(){
	    			$(this).css({background: "#FFFFFF"});
	    		});
			}
		},
		/***创建alert单按钮消息弹窗
		 	@param {string} title 标题
		 	@param {string} content: 提示内容
		 	@param {bool} mask 是否显示遮罩层，默认false不显示，true显示
		 	@param {bool} maskTouch mask为true时遮罩层拖动或点击是否关闭弹窗，默认false不关闭，true关闭
		 	@param {Array} btns 底部按钮 默认['确定']  或 [{name: '按钮1', color: ''},{name: '按钮2', color: ''}]
		 	@example: cui.alert({title: '', content: '', mask: true, btns: ['确定']},function(e){});
		 */
		alert: function(set, callback){
			var d = this.default(set);
			this.dialog(set, callback);
			$(".cui-dialog").addClass("cui-alert");
			$(".cui-dialog-down-btn").click(function(){
				var index = Number($(this).attr("index"));
				$(".cui-alert").css({"animation": "cui-fade-out .1s ease-out"});
				$(".cui-alert .cui-dialog-main").css({'animation': 'cui-scale-out .1s ease-out'});
				setTimeout(function(){
					$(".cui-alert").remove();
					callback ? callback({index: index}) : '';
				},200);
			});
		},
		/***创建confirm双按钮消息弹窗
		 	@param {string} title 标题
		 	@param {string} content: 提示内容
		 	@param {bool} mask 是否显示遮罩层，默认false不显示，true显示
		 	@param {bool} maskTouch mask为true时遮罩层拖动或点击是否关闭弹窗，默认false不关闭，true关闭
		 	@param {Array} btns 底部按钮 默认['确定']  或 [{name: '按钮1', color: ''},{name: '按钮2', color: ''}]
		 	@example: cui.confirm({title: '', content: '', mask: true, btns: ['取消', '确定']},function(e){});
		 */
		confirm: function(set, callback){
			var d = this.default(set);
			this.dialog(set, callback);
			$(".cui-dialog").addClass("cui-confirm");
			$(".cui-dialog-down-btn").click(function(){
				var index = Number($(this).attr("index"));
				$(".cui-confirm").css({"animation": "cui-fade-out .1s ease-out"});
				$(".cui-confirm .cui-dialog-main").css({'animation': 'cui-scale-out .1s ease-out'});
				setTimeout(function(){
					$(".cui-confirm").remove();
					callback ? callback({index: index}) : '';
				},200);
			});
		},
		/***创建delete删除消息弹窗
		 	@param {string} title 标题
		 	@param {string} content: 提示内容
		 	@param {bool} mask 是否显示遮罩层，默认false不显示，true显示
		 	@param {bool} maskTouch mask为true时遮罩层拖动或点击是否关闭弹窗，默认false不关闭，true关闭
		 	@param {Array} btns 底部按钮 默认['确定']  或 [{name: '按钮1', color: ''},{name: '按钮2', color: ''}]
		 	@example: cui.delete({title: '', content: '', mask: true, btns: ['取消', '删除']},function(e){});
		 */
		delete: function(set, callback){
			var d = this.default(set);
			this.dialog(set, callback);
			$(".cui-dialog").addClass("cui-delete");
			$(".cui-dialog-down-btn").click(function(){
				var index = Number($(this).attr("index"));
				$(".cui-delete").css({"animation": "cui-fade-out .1s ease-out"});
				$(".cui-delete .cui-dialog-main").css({'animation': 'cui-scale-out .1s ease-out'});
				setTimeout(function(){
					$(".cui-delete").remove();
					callback ? callback({index: index}) : '';
				},200);
			});
		},
		/***创建input输入框弹窗
		 	@param {string} title 标题
		 	@param {Array} items: input框列表配置[{label: '姓名：', type: 'text', value: '(可选)', placeholder: '请输入姓名'}]
		 	@param {bool} mask 是否显示遮罩层，默认false不显示，true显示
		 	@param {bool} maskTouch mask为true时遮罩层拖动或点击是否关闭弹窗，默认false不关闭，true关闭
		 	@param {Array} btns 底部按钮 默认['确定']  或 [{name: '按钮1', color: ''},{name: '按钮2', color: ''}]
		 	@example: cui.popinput({title: '', items: [{label: '姓名：', type: 'text', value: '(可选)', placeholder: '请输入姓名'}], mask: true, btns: ['取消', '确定']},function(e){});
		 */
		popinput: function(set, callback){
			var d = this.default(set);
			this.dialog(set, callback);
			$(".cui-dialog").addClass("cui-popinput");
			var inputList = '';
			if(d.items && d.items.length > 0)
			{
				for(var i = 0; i < d.items.length; i++)
				{
					d.items[i].label ? d.items[i].label = d.items[i].label : d.items[i].label = '';
					d.items[i].type ? d.items[i].type = d.items[i].type : d.items[i].type = 'text';
					d.items[i].value ? d.items[i].value = d.items[i].value : d.items[i].value = '';
					d.items[i].placeholder ? d.items[i].placeholder = d.items[i].placeholder : d.items[i].placeholder = '';
					inputList +=
					'<div class="cui-dialog-input-list">'
						+'<label>'+ d.items[i].label +'</label>'
						+'<input type="'+ d.items[i].type +'" value="'+ d.items[i].value +'" placeholder="'+ d.items[i].placeholder +'" />'
						+'<span class="cui-input-clear"><i></i></span>'
					+'</div>'
				}
			}
			else
			{
				inputList =
				'<div class="cui-dialog-input-list">'
					+'<input type="text" value="" placeholder="请输入" />'
					+'<span class="cui-input-clear"><i></i></span>'
				+'</div>'
			}
			$(".cui-popinput .cui-dialog-content").html(inputList);
			setTimeout(function(){
				$(".cui-dialog-input-list").eq(0).find("input").focus();
			},300);
			//清楚输入内容
			$(".cui-input-clear").click(function(){
    			$(this).parent(".cui-dialog-input-list").find("input").val('');
    			$(this).find("i").css({opacity: 0});
    		});
    		//输入检测
			$(".cui-dialog-input-list input").on("input",function(){
    			var length = $(this).val().length;
    			if(length > 0)
    			{
    				$(this).parent().find(".cui-input-clear i").css({opacity: 1});
    			}
    			else
    			{
    				$(this).parent().find(".cui-input-clear i").css({opacity: 0});
    			}
    		});
			$(".cui-dialog-down-btn").click(function(){
				var index = Number($(this).attr("index"));
				var result = [];
				$(".cui-dialog-input-list").each(function(i){
					if($(this).find("input").val().length > 0)
					{
						result.push($(this).find("input").val());
					}
					else
					{
						result.push('');
					}
				});
				$(".cui-popinput").css({"animation": "cui-fade-out .1s ease-out forwards"});
				$(".cui-popinput .cui-dialog-main").css({'animation': 'cui-scale-out .1s ease-out forwards'});
				setTimeout(function(){
					$(".cui-popinput").remove();
					callback ? callback({index: index, result: result}) : '';
				},200);
			});
		},
		/***创建textarea文本输入弹窗
		 	@param {string} title 标题
		 	@param {string} value: 文本框内容（可选）
		 	@param {string} placeholder: 文本框提示
		 	@param {bool} mask 是否显示遮罩层，默认false不显示，true显示
		 	@param {bool} maskTouch mask为true时遮罩层拖动或点击是否关闭弹窗，默认false不关闭，true关闭
		 	@param {Array} btns 底部按钮 默认['确定']  或 [{name: '按钮1', color: ''},{name: '按钮2', color: ''}]
		 	@example: cui.poptextarea({title: '', placeholder: '请输入姓名', mask: true, btns: ['取消', '确定']},function(e){});
		 */
		poptextarea: function(set, callback){
			var d = this.default(set);
			this.dialog(set, callback);
			$(".cui-dialog").addClass("cui-poptextarea");
			this.isDefine(d.placeholder) ? d.placeholder = d.placeholder : d.placeholder = '请输入';
			this.isDefine(d.value) ? d.value = d.value : d.value = '';
			var html = '<textarea name="" rows="" cols="" placeholder="'+ d.placeholder +'" value="'+ d.value +'"></textarea>';
			$(".cui-poptextarea .cui-dialog-content").html(html);
			$(".cui-poptextarea .cui-dialog-content").css({paddingBottom: "10px"});
			setTimeout(function(){
				$(".cui-poptextarea").find("textarea").focus();
			},100);
			$(".cui-poptextarea textarea").autoTextarea({
		   		maxHeight: 300,
		    	minHeight: 100,
		 	});
			$(".cui-dialog-down-btn").click(function(){
				var index = Number($(this).attr("index"));
				var result = $(".cui-poptextarea").find("textarea").val();
				$(".cui-poptextarea").find("textarea").blur();
				$(".cui-poptextarea").css({"animation": "cui-fade-out .1s ease-out forwards"});
				// $(".cui-poptextarea .cui-dialog-main").css({'animation': 'cui-scale-out .1s ease-out forwards'});
				setTimeout(function(){
					$(".cui-poptextarea").remove();
					callback ? callback({index: index, result: result}) : '';
				},200);
			});
		},
		/***创建actionSheet底部操作弹窗
		 	@param {string} title 标题
		 	@param {bool} mask 是否显示遮罩层，默认false不显示，true显示
		 	@param {bool} maskTouch mask为true时遮罩层拖动或点击是否关闭弹窗，默认false不关闭，true关闭
		 	@param {Array} items 底部按钮  [{name: '按钮1', color: ''},{name: '按钮2', color: ''}]
		 	@param {string} cancel 取消按钮(默认'取消')
		 	@example: cui.actionSheet({title: '', mask: true, items: [{name: '按钮1', color: ''},{name: '按钮2', color: ''}], cancel: '取消'},function(e){});
		 */
		actionSheet: function(set, callback){
			var d = this.default(set);
			var html = '<div class="cui-actionsheet">'
				+'<div class="cui-actionsheet-main"></div>'
			+'</div>';
			$("body").append(html);
			d.mask ? $(".cui-actionsheet-main").before('<div class="cui-mask"></div>') : "";
			d.title ? $(".cui-actionsheet-main").append('<div class="cui-actionsheet-title">'+ d.title +'</div>') : "";
			for(var i in d.items)
			{
				$(".cui-actionsheet-main").append('<div class="cui-actionsheet-item" index="'+ (Number(i) + 1) +'">'+ d.items[i].name +'</div>');
				if(d.items[i].color)
				{
					$(".cui-actionsheet-main").find(".cui-actionsheet-item").eq(i).css({color: d.items[i].color});
				}
			}
			d.cancel ? d.cancel = d.cancel : d.cancel = '取消';
			$(".cui-actionsheet-main").append('<div class="cui-actionsheet-btn" index="'+ 0 +'">'+ d.cancel +'</div>')
			if(d.maskTouch)
			{
				$(".cui-actionsheet-main").on("touchmove",function(e){
	    			e.preventDefault();
	    		});
	    		$(".cui-actionsheet .cui-mask").on("touchmove click", function(e){
	    			$(".cui-actionsheet").css({"animation": "cui-fade-out .2s ease-out"});
					$(".cui-actionsheet .cui-actionsheet-main").css({'animation': 'cui-slideDown .2s ease-out'});
					setTimeout(function(){
						$(".cui-actionsheet").remove();
					},100);
	    		});
	    	}
			else
			{
				$(".cui-actionsheet").on("touchmove",function(e){
	    			e.preventDefault();
	    		});
			}
    		$(".cui-actionsheet-item,.cui-actionsheet-btn").on("touchstart",function(){
    			$(this).css({background: "#EFEFEF"});
    		});
    		$(".cui-actionsheet-item,.cui-actionsheet-btn").on("touchend",function(){
    			$(this).css({background: "#FFFFFF"});
    		});
    		$(".cui-actionsheet-item,.cui-actionsheet-btn").click(function(){
    			var index = Number($(this).attr("index"));
				$(".cui-actionsheet").css({"animation": "cui-fade-out .2s ease-out"});
				$(".cui-actionsheet .cui-actionsheet-main").css({'animation': 'cui-slideDown .2s ease-out'});
				setTimeout(function(){
					$(".cui-actionsheet").remove();
					callback ? callback({index: index}) : '';
				},200);
    		});
		},
		/***页面无数据显示
		   @param {String} warp 父元素名称(".class"或"#id")
		   @param {String} icon 提示图片
		   @param {String} content 提示文字
		   @param {Array} btns 按钮（可选）
		   @example: cui.noData({warp: '', icon: '', content: '', btns: ['去逛逛']}, function(e){console.log(e);});
		 */
		noData: function(set ,callback){
			var d = this.default(set);
			d.warp ? d.warp = d.warp : d.warp = 'body';
			var html =
			'<div class="cui-nodata">'
				+'<div class="cui-nodata-main">'

				+'</div>'
			+'</div>';
			$(d.warp).html(html);
			$(".cui-nodata").css({height: $(d.warp).height() - 5, background: $(d.warp).css("background-color")});
			if(d.icon)
			{
				$(".cui-nodata-main").append('<img src="'+ d.icon +'" />');
			}
			if(d.content)
			{
				$(".cui-nodata-main").append('<p class="cui-nodata-content">'+ d.content +'</p>');
			}
			if(d.btns[0] != "确定")
			{
				$(".cui-nodata-main").append('<button class="cui-btn">'+ d.btns[0] +'</button>');
				$(".cui-nodata .cui-btn").click(function(){
					callback ? callback() : '';
				});
			}
			$(".cui-nodata").on("touchmove",function(e){
    			e.preventDefault();
	    	});
		},
		/***菜单弹窗
		   @param {String} warp 父元素名称(".class"或"#id")
		   @param {bool} mask 是否显示遮罩层，默认false不显示，true显示
		   @param {bool} maskTouch mask为true时遮罩层拖动或点击是否关闭弹窗，默认false不关闭，true关闭
		   @param {Array} items 弹出菜单数据配置 [{icon: '图标（可选）', name: '菜单名称'}, {icon: '', name: ''}]
		   @example: cui.popover({warp: '', mask: true, items: [{icon: '', name: ''}], function(e){console.log(e);});
		 */
		popover: function(set, callback){
			var d = this.default(set);
			d.warp ? d.warp = d.warp : d.warp = 'body';
			var html =
			'<div class="cui-popover">'
				+'<div class="cui-popover-main">'

				+'</div>'
			+'</div>';
			$("body").append(html);
			d.mask ? $(".cui-popover-main").before('<div class="cui-mask"></div>') : "";
			for(var i = 0; i < d.items.length; i++)
			{
				if(d.items[i].icon)
				{
					$(".cui-popover-main").append(
						'<div class="cui-popover-item"index="'+ (Number(i) + 1) +'">'
							+'<img src="'+ d.items[i].icon +'">'
							+'<span>'+ d.items[i].name +'</span>'
						+'</div>'
					);
				}
				else
				{
					$(".cui-popover-main").append(
						'<div class="cui-popover-item" index="'+ (Number(i) + 1) +'">'
							+'<span style="width: 100%;">'+ d.items[i].name +'</span>'
						+'</div>'
					);
				}
			}
			$(".cui-popover-main").css({
				top: ($(".cui-popover").height() - $(".cui-popover-main").height()) / 2 + "px",
				left: ($(".cui-popover").width() - $(".cui-popover-main").width()) / 2 + "px"
			});
			//指定标签位置菜单弹出
			if(d.warp != 'body' && d.warp != '.content')
			{
				$(".cui-popover").addClass("cui-popover-div").find(".cui-popover-main").css({width: 'auto'});
				$(".cui-popover-div .cui-popover-main").find(".cui-popover-item").eq(0).before(
					'<div class="cui-arrow"></div>'
				);
				$(".cui-popover-div .cui-popover-main").find(".cui-popover-item").eq(0).css({
					"border-top-left-radius": "4px",
					"border-top-right-radius": "4px"
				});
				$(".cui-popover-div .cui-popover-main").find(".cui-popover-item").eq($(".cui-popover-div .cui-popover-main").find(".cui-popover-item").length - 1).css({
					"border-bottom-left-radius": "4px",
					"border-bottom-right-radius": "4px"
				});
				d.maskTouch == false ? d.maskTouch = true : d.maskTouch = d.maskTouch;
				var ui = {
					b_w: $("body").width(),
					warp_w: $(d.warp).width(),
					warp_h: $(d.warp).height(),
					warp_top: $(d.warp).offset().top,
					warp_left: $(d.warp).offset().left,
					header_h: $("header").height() ? $("header").height() : 0,
					b_scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
					popover_w: $(".cui-popover-div .cui-popover-main").width(),
					popover_h: $(".cui-popover-div .cui-popover-main").height(),
					arrow_h: $(".cui-popover-div .cui-arrow").height()
				}
				if(ui.warp_top - ui.b_scrollTop - ui.header_h < ui.popover_h + ui.arrow_h)
				{ //菜单弹窗位于按钮之下
					var popover_top = ui.warp_top - ui.b_scrollTop+ ui.warp_h + ui.arrow_h + "px";
					$(".cui-arrow").css({
						top: "-5px",
						bottom: "auto",
						left: "-webkit-calc(50% - 5px)",
						left: "calc(50% - 5px)",
						"box-shadow": "-1px -1px 1px rgba(150,150,150,0.3)"
					});
				}
				else
				{ //菜单弹窗位于按钮之上
					var popover_top = ui.warp_top - ui.b_scrollTop - ui.popover_h - ui.arrow_h + "px";
					$(".cui-arrow").css({
						top: "auto",
						bottom: "-5px",
						left: "-webkit-calc(50% - 5px)",
						left: "calc(50% - 5px)",
						"box-shadow": "1px 1px 1px rgba(150,150,150,0.3)"
					});
				}
				var popover_left = ui.warp_left + ui.warp_w / 2 - ui.popover_w / 2 + "px";
				$(".cui-popover-div .cui-popover-main").css({
					width: 'auto',
					top: popover_top,
					left: popover_left
				});
				if($(".cui-popover-div .cui-popover-main").offset().left + ui.popover_w >= ui.b_w)
				{ //超出右边界
					$(".cui-popover-div .cui-popover-main").css({right: '10px', left: 'auto'});
					$(".cui-arrow").css({right: ui.warp_w / 2 - 4 + "px", left:"auto"});
				}
				if($(".cui-popover-div .cui-popover-main").offset().left <= 10)
				{ //超出左边界
					$(".cui-popover-div .cui-popover-main").css({left: '10px'});
					$(".cui-arrow").css({left: ui.warp_w / 2 - 4 + "px", right:"auto"});
				}
			}
			if(d.maskTouch)
			{
	    		$(".cui-popover-main").on("touchmove",function(e){
	    			e.preventDefault();
	    		});
	    		$(".cui-popover").on("touchmove click", function(e){
	    			$(".cui-popover").css({"animation": "cui-fade-out .2s ease-out"});
					$(".cui-popover .cui-popover-main").css({'animation': 'cui-scale-out-2 .2s ease-out'});
					setTimeout(function(){
						$(".cui-popover").remove();
					},100);
	    		});
			}
			else
			{
				$(".cui-popover").on("touchmove",function(e){
	    			e.preventDefault();
	    		});
			}
    		$(".cui-popover-item").on("touchstart",function(){
    			$(this).css({background: "#EFEFF4"});
    		});
    		$(".cui-popover-item").on("touchend",function(){
    			$(this).css({background: "#FFFFFF"});
    		});
    		$(".cui-popover-item").click(function(){
    			var index = Number($(this).attr("index"));
				$(".cui-popover").css({"animation": "cui-fade-out .2s ease-out"});
				$(".cui-popover .cui-popover-main").css({'animation': 'cui-scale-out-2 .2s ease-out'});
				setTimeout(function(){
					$(".cui-popover").remove();
					callback ? callback({index: index}) : '';
				},200);
    		});
		},
		/***广告弹窗
		   @param {Array} icons 广告弹窗
		   @param {bool} mask 是否显示遮罩层，默认false不显示，true显示
		   @param {bool} maskTouch mask为true时遮罩层拖动或点击是否关闭弹窗，默认false不关闭，true关闭
		   @param {Array} btns 按钮（可选
		   @example: cui.popover({icons: '', mask: true, function(){});
		 */
		poster: function(set, callback){
			var d = this.default(set);
			var html =
			'<div class="cui-poster">'
				+'<div class="cui-mask"></div>'
				+'<div class="cui-poster-main">'
					+'<div class="cui-poster-content">'

					+'</div>'
					+'<div class="cui-poster-close"><span></span></div>'
				+'</div>'
			+'</div>';
			$("body").append(html);
			cui.isDefine(d.icons) ? $(".cui-poster-content").append('<img src="'+ d.icons +'">') : '';
			cui.isDefine(d.html) ? $(".cui-poster-content").append(html) : '';
			cui.isDefine(d.btns) && d.btns[0] != '确定' ? $(".cui-poster-content").append('<span class="cui-btn">'+ d.btns[0] +'</span>') : '';
			if(d.maskTouch)
			{
	    		$(".cui-poster-main").on("touchmove",function(e){
	    			e.preventDefault();
	    		});
	    		$(".cui-poster").on("touchmove click", function(e){
	    			$(".cui-poster").css({"animation": "cui-fade-out .2s ease-out"});
					$(".cui-poster .cui-poster-main").css({'animation': 'cui-scale-out .2s ease-out'});
					setTimeout(function(){
						$(".cui-poster").remove();
						callback ? callback({index: 0}) : '';
					},100);
	    		});
			}
			else
			{
				$(".cui-poster").on("touchmove",function(e){
	    			e.preventDefault();
	    		});
			}
			$(".cui-poster .cui-btn").click(function(){
				$(".cui-poster").css({"animation": "cui-fade-out .2s ease-out"});
				$(".cui-poster .cui-poster-main").css({'animation': 'cui-scale-out .2s ease-out'});
				setTimeout(function(){
					$(".cui-poster").remove();
					callback ? callback({index: 1}) : '';
				},200);
    		});
    		$(".cui-poster-close").click(function(){
				$(".cui-poster").css({"animation": "cui-fade-out .2s ease-out"});
				$(".cui-poster .cui-poster-main").css({'animation': 'cui-scale-out .2s ease-out'});
				setTimeout(function(){
					$(".cui-poster").remove();
					callback ? callback({index: 0}) : '';
				},200);
    		});
		},
		/***评论输入弹窗
		   @param {string} placeholder 输入框内提示内容 默认 '写评论...'
		   @param {bool} mask 遮罩层 默认false
		   @param {number} maxlength 最大输入长度 默认 200
		   @example: cui.rating({placeholder: '', mask: true, function(e){console.log(e.result)});
		 */
		rating: function(set, callback){
			var d = this.default(set);
			this.isDefine(d.placeholder) ? d.placeholder = d.placeholder : d.placeholder = '写评论...';
			this.isDefine(d.maxlength) ? d.maxlength = d.maxlength : d.maxlength = 200;
			var html =
			'<div class="cui-rating">'
				+'<div class="cui-rating-main">'
					+'<div class="cui-rating-left">'
						+'<textarea type="text" class="cui-rating-textarea" placeholder="'+ d.placeholder +'" maxlength="'+ d.maxlength +'"></textarea>'
					+'</div>'
					+'<div class="cui-rating-right">'
						+'<span class="cui-rating-sendbtn no-send">发送</span>'
						//+'<span class="cui-rating-sendbtn is-send">发送</span>'
					+'</div>'
				+'</div>'
			+'</div>';
			if($(".cui-rating").length > 0)
			{
				$(".cui-rating").fadeIn(50);
			}
			else
			{
				$('body').append(html);
				d.mask ? $(".cui-rating-main").before('<div class="cui-mask"></div>') : '';
				$(".cui-rating").fadeIn(50);
			}
			setTimeout(function(){
				$(".cui-rating-textarea").focus();
			},50);
			window.onresize = function(){
				$(".cui-rating-main").css({bottom: 0});
			}
			//触摸遮罩层关闭
			$(".cui-rating .cui-mask").on("touchmove click", function(e){
				e.preventDefault();
    			$(".cui-rating").fadeOut(50);
    		});
			$(".cui-rating-textarea").autoTextarea({
		   		maxHeight: 150,
		    	minHeight: 35,
		 	});
			var result;
			//输入检测
			$(".cui-rating-textarea").on("input",function(){
				result = $(".cui-rating-textarea").val();
				if(result.length > 0)
				{
					$(".cui-rating-sendbtn").attr({'class': "cui-rating-sendbtn is-send"});
					$(".cui-rating").css({height: document.querySelector(".cui-rating-textarea").offsetHeight + 20});
				}
				else
				{
					$(".cui-rating-sendbtn").attr({'class': "cui-rating-sendbtn no-send"});
				}
			});
			//点击发送
			$(".cui-rating-sendbtn").click(function(){
				if($(".cui-rating-sendbtn").attr('class') != 'cui-rating-sendbtn is-send')
				{
					$(".cui-rating-textarea").focus();
					return;
				}
				$(".cui-rating").fadeOut(50);
				callback ? callback({result: result}) : '';
				result = '';
				$(".cui-rating-textarea").val('');
				$(".cui-rating-sendbtn").attr({'class': "cui-rating-sendbtn no-send"});
			});
		},
		/***分享弹窗
		    @param {string} title 标题
		 	@param {bool} mask 是否显示遮罩层，默认false不显示，true显示
		 	@param {bool} maskTouch mask为true时遮罩层拖动或点击是否关闭弹窗，默认false不关闭，true关闭
		 	@param {Array} items 分享按钮  [{name: '按钮1', icon: '图标路径'},{name: '按钮2', icon: ''}]
		 	@param {string} cancel 取消按钮(默认'取消')
		 	@example: cui.share({title: '', mask: true, items: [{name: '按钮1', icon: '图标路径'},{name: '按钮2', icon: ''}], cancel: '取消'},function(e){});
		 */
		share: function(set, callback){
			var d = this.default(set);
			if($(".cui-share").length > 0)
			{
				return;
			}
			else
			{
				d.title ? d.title = d.title : d.title = '分享至';
				var html =
				'<div class="cui-share">'
					+'<div class="cui-mask"></div>'
					+'<div class="cui-share-main">'
						+'<div class="cui-share-title">'+ d.title +'</div>'
						+'<div class="cui-share-items">'

						+'</div>'
					+'</div>'
				+'</div>';
				$("body").append(html);
				for(var i in d.items)
				{
					$(".cui-share-items").append('<div class="cui-share-item" index="'+ (Number(i) + 1 ) +'">'
						+'<img src="'+ d.items[i].icon +'">'
						+'<p>'+ d.items[i].name +'</p>'
					+'</div>');
				}
				d.cancel ? d.cancel = d.cancel : d.cancel = '取消';
				$(".cui-share-main").append('<div class="cui-share-btn" index="'+ 0 +'">'+ d.cancel +'</div>');
				if(d.maskTouch)
				{
					$(".cui-share-main").on("touchmove",function(e){
		    			e.preventDefault();
		    		});
		    		$(".cui-share .cui-mask").on("touchmove click", function(e){
		    			$(".cui-share").css({"animation": "cui-fade-out .2s ease-out"});
						$(".cui-share .cui-share-main").css({'animation': 'cui-slideDown2 .2s ease-out'});
						setTimeout(function(){
							$(".cui-share").remove();
							callback ? callback({index: 0}) : '';
						},100);
		    		});
		    	}
				else
				{
					$(".cui-share").on("touchmove",function(e){
		    			e.preventDefault();
		    		});
				}
	    		$(".cui-share-item,.cui-share-btn").on("touchstart",function(){
	    			$(this).css({background: "#EFEFEF"});
	    		});
	    		$(".cui-share-item,.cui-share-btn").on("touchend",function(){
	    			$(this).css({background: "#FFFFFF"});
	    		});
	    		$(".cui-share-item,.cui-share-btn").click(function(){
	    			var index = Number($(this).attr("index"));
					$(".cui-share").css({"animation": "cui-fade-out .2s ease-out"});
					$(".cui-share .cui-share-main").css({'animation': 'cui-slideDown2 .2s ease-out'});
					setTimeout(function(){
						$(".cui-share").remove();
						callback ? callback({index: index}) : '';
					},200);
	    		});
			}
		},
		/***返回顶部
		 	@param {String} warp(可选) 父元素名称(".class"或"#id"), 默认document
		    @param {String} icon 按钮图标
		    @param {number} scrolltop 设置滚动页面到**位置后显示返回顶部按钮（默认200'px'）
		    @param {number} scrolltime 点击返回顶部按钮后返回顶部的时间（单位：毫秒； 默认200毫秒）
		    @example: cui.backtop({warp: '', icon: '', scrolltop: 100, scrolltime: 200});
		 */
		backtop: function(set){
			var d = this.default(set);
			if($(".cui-backtop").length > 0)
			{
				return;
			}
			var html = '<div class="cui-backtop"><img src="'+ d.icon +'"></div>';
			$("body").append(html);
			d.warp && d.warp != 'body' ? d.warp = d.warp : d.warp = window;
			d.scrolltop ? d.scrolltop = d.scrolltop : d.scrolltop = 200;
			$(d.warp).scroll(function(){
				d.warp == window ? d.warp = document : d.warp = d.warp;
				var scroll_top = $(d.warp).scrollTop();
				if(scroll_top >= d.scrolltop)
				{
					$(".cui-backtop").fadeIn(300);
				}
				else
				{
					$(".cui-backtop").fadeOut(300);
				}
			});
			//返回顶部按钮点击事件
			$(".cui-backtop").on("click",function(){
				d.warp == document || d.warp == 'body' || d.warp == window ? d.warp = 'body' : d.warp = d.warp;
				d.scrolltime ? d.scrolltime = d.scrolltime : d.scrolltime = 200;
				$(d.warp).animate({scrollTop: 0}, d.scrolltime);
			});
		},
		/***对象合并
		   @param {Object} opts 原始参数
		   @param {Object} set 新参数
		   @param {bool} override 是否合并重置
		 */
		extend: function(opts, set, override){
			for(let key in set) {
				if(set.hasOwnProperty(key) && (!opts.hasOwnProperty(key) || override))
				{
					opts[key] = set[key];
				}
			}
			return opts;
		},
		/***判断字符串是否为空
		   @param {string} str 字符串
   		   @example: cui.isDefine(str)
   		*/
   		isDefine: function(str){
   			if (str == null || str == "" || str == "undefined" || str == undefined || str == "null" || str == "(null)" || str == 'NULL' || typeof (str) == 'undefined')
			{
				return false;
			}
			else
			{
				str = str + "";
				str = str.replace(/\s/g, "");
				if (str == "")
				{
					return false;
				}
				return true;
			}
   		},
   		/***判断是否为微信浏览器
   		 	@example: cui.isWx();
   		*/
   		isWx: ()=>{
   			const ua = window.navigator.userAgent.toLowerCase();
		  	//通过正则表达式匹配ua中是否含有MicroMessenger字符串
		  	if(ua.match(/MicroMessenger/i) == 'micromessenger')
		  	{
		 		return true;
		  	}
		  	else
		  	{
		  		return false;
		  	}
   		},
   		/***判断是否为IOS系统
   		 	@example: cui.isIOS();
   		*/
   		isIOS: function(){
   			var u = navigator.userAgent, app = navigator.appVersion;
		    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
		    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		    if(isIOS)
		    {
		    	return true;
		    }
		    else
		    {
		    	return false;
		    }
   		},
   		/***判断是否为android系统
   		 	@example: cui.isAndroid();
   		*/
   		isAndroid: function(){
   			var u = navigator.userAgent, app = navigator.appVersion;
		    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
		    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		    if(isAndroid)
		    {
		    	return true;
		    }
		    else
		    {
		    	return false;
		    }
   		},
   		/***判断是否为PC
   		 	@example: cui.isPC();
   		*/
   		isPC: function(){
   			var userAgentInfo = navigator.userAgent;
		    var Agents = ["Android", "iPhone",
		        "SymbianOS", "Windows Phone",
		        "iPad", "iPod"];
		    var flag = true;
		    for (var v = 0; v < Agents.length; v++)
		    {
		        if (userAgentInfo.indexOf(Agents[v]) > 0)
		        {
		            flag = false;
		            break;
		        }
		    }
		    return flag;
   		},
   		/***获取设备网络类型
   		 	@example: cui.getNetworkType();
   		*/
   		getNetworkType: function(){
   			var ua = navigator.userAgent;
            var networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
            networkStr = networkStr.toLowerCase().replace('nettype/', '');
            var networkType;
            switch (networkStr) {
                case 'wifi':
                    networkType = 'wifi';
                    break;
                case '4g':
                    networkType = '4g';
                    break;
                case '3g':
                    networkType = '3g';
                    break;
                case '3gnet':
                    networkType = '3g';
                    break;
                case '2g':
                    networkType = '2g';
                    break;
                default:
                    networkType = 'other';
            }
            return networkType;
   		},
   		/***获取设备是否连接网络
   		 	@example: cui.getLine();
   		*/
   		getLine: function(){
   			if(navigator.onLine)
   			{
   				return true;
   			}
   			else
   			{
   				return false;
   			}
   		},
   		/***时间戳转换成几分钟前，几小时前，几天前，xxxx(年)-xx(月)-xx(日) xx(时): xx(分): xx(秒)
   		 	@param {string} timestamp 时间戳
   		 	@example: cui.formatMsgTime('时间戳');
   		*/
   		formatMsgTime: function(timestamp){
			var dateTime = new Date(timestamp);
			var year = dateTime.getFullYear();
			var month = dateTime.getMonth() + 1;
			var day = dateTime.getDate();
			var hour = dateTime.getHours();
			var minute = dateTime.getMinutes();
			var second = dateTime.getSeconds();
			var now = new Date();
			var now_new = Date.parse(now.toDateString());  //typescript转换写法
			var milliseconds = 0;
			var timeSpanStr;
			milliseconds = now_new - timestamp;
			if (milliseconds <= 1000 * 60 * 1)
			{
			   timeSpanStr = '刚刚';
			}
			else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60)
			{
			   timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
			}
			else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24)
			{
			   timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
			}
			else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15)
			{
			   timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
			}
			else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear())
			{
			   timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
			}
			else
			{
			   timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
			}
			return timeSpanStr;
		},
	}
	// 将插件对象暴露给全局对象
    Global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports)
    {
        module.exports = cui;
    }
    else if (typeof define === "function" && define.amd)
    {
        define(function(){return cui;});
    }
    else
    {
        !('cui' in Global) && (Global.cui = cui);
    }
})(jQuery, window, document);
/*
 * Description: 根据输入的文本自动改变textarea框的高度   
 * 调用 方式：
 * $("#textarea").autoTextarea({
 *  	maxHeight:150,
 *   	minHeight:120
 * 	});
 */
(function($){
  $.fn.autoTextarea = function(options) {
    var defaults={
      maxHeight:null,
      minHeight:$(this).height()
    };
    var opts = $.extend({},defaults,options);
    return $(this).each(function() {
      $(this).bind("paste cut keydown keyup focus blur",function(){
        var height,style=this.style;
        this.style.height = opts.minHeight + 'px';
        if (this.scrollHeight > opts.minHeight)
        {
          if (opts.maxHeight && this.scrollHeight > opts.maxHeight)
          {
            height = opts.maxHeight;
            style.overflowY = 'scroll';
          }
          else
          {
            height = this.scrollHeight;
            style.overflowY = 'hidden';
          }
          style.height = height + 'px';
        }
      });
    });
  };
})(jQuery);
