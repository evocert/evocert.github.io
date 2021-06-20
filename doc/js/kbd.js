define([
	"module",
	"jquery"
],function(
	module,
	_$
){
	$=_$.noConflict();
	//find elements
	var banner=$("#banner-message")
	var button=$("button")
	//handle click and add class
	button.on("click",function(){
		if(banner.hasClass("alt"))
			banner.removeClass("alt")
		else
			banner.addClass("alt")
	})
	$(document).ready(function(){
		var idx=0;





		var kbdbuf=[];
		var fnbuf={
			"/":(function(){
				var div=$("<div/>");
				div.css({
					"width":"auto",
					"position":"fixed",
					"padding":"12px",
					"border-radius":"4px",
					"margin":"4px",
					"background":"#555555",
					"right":"0px",
					"top":"0px",
				});
				var input=$("<input/>")
				div.append(input);
				$("body").append(div);
				div.hide();
				input.on("keyup",function(e){
					kbdbuf=[];
					if(e.key=="Escape"){
						input.blur();
						div.hide();
					}else if(e.key=="Enter"){
						input.blur();
						div.hide();
						if(typeof(fnbuf[input.val()])=="function")try{fnbuf[input.val()]()}catch(e){console.error(e);}else{
							var els=$("a");
							var el=els.find("selected");
							els.removeClass("selected");
							var el=$("a:contains("+input.val()+")");
							if(el.length==0)return;
							el.first().addClass("selected").focus();
							$('html, body').animate({ scrollTop:el.offset().top-100 }, 10);
						};
					}else{
						var els=$("a");
						els.removeClass("selected");
						var el=$("a:contains("+input.val()+")").first();
						if(el.length==0)return;
						el.addClass("selected");
						$('html, body').animate({ scrollTop:el.offset().top-100 }, 10);
					}


				}.bind(this));
				return function(){
					div.show();
					input.val("");
					input.focus();
				}
			})(),
			"build":function(){buildClient();},
			"reload":function(){window.location.reload();},
			"rewq":function(){console.log("cmd1");},
			"asdf":function(){console.log("cmd2");},
			"fdsa":function(){console.log("cmd3");},
			"zxcv":function(){console.log("cmd4");},
			"vcxz":function(){console.log("cmd5");}
		};
		$(document).on("keydown",function(e){
			if(e.key=="/"){
				e.stopPropagation();
				e.preventDefault();
			}
			if(!$("input,textarea").is(":focus")){
				if(e.key.length==1){
					kbdbuf.push(e.key);
					bufln=kbdbuf.join("");
					if(typeof(fnbuf[bufln])=="function"){
						try{fnbuf[bufln]();}catch(e){console.error(e.toString())};
						kbdbuf=[];
					}
				}else{
					kbdbuf=[];
				}
			}else{
				kbdbuf=[];
			}
			if(e.key=="ArrowLeft"){
				e.stopPropagation();
				e.preventDefault();
				$(".back").click();
			}
			if(e.key=="ArrowDown"){
				e.stopPropagation();
				e.preventDefault();
				idx++;
				var found=false;
				var els=$("a");
				els.removeClass("selected");
				if(idx>els.length-1)idx=els.length-1;
				//if(!found)idx=0;else idx++;
				$(els.toArray()[idx]).addClass("selected");
				$(els.toArray()[idx]).focus();
				$('html, body').animate({ scrollTop:$(els.toArray()[idx]).offset().top-100 }, 10);
			}
			if(e.key=="ArrowUp"){
				e.stopPropagation();
				e.preventDefault();
				idx--;
				var found=false;
				var els=$("a");
				els.removeClass("selected");
				if(idx<0)idx=0;
				//if(!found)idx=0;else idx++;
				$(els.toArray()[idx]).addClass("selected");
				$(els.toArray()[idx]).focus();
				$('html, body').animate({ scrollTop:$(els.toArray()[idx]).offset().top-100 }, 10);
			}
			if(e.ctrlKey&&!e.altKey&&e.key.length==1){
				e.stopPropagation();
				e.preventDefault();
				$("."+"ctrl-"+e.key).click();
			}
			if(!e.ctrlKey&&e.altKey&&e.key.length==1){
				e.stopPropagation();
				e.preventDefault();
				$("."+"alt-"+e.key).click();
			}
			if(e.ctrlKey&&e.altKey&&e.key.length==1){
				e.stopPropagation();
				e.preventDefault();
				$("."+"ctrl-alt-"+e.key).click();
			}
		});
	});
	module.exports={};
});
