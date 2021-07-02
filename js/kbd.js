define([
	"module",
	"jquery",
	"./session.js",
	"./objutils.js"
],function(
	module,
	_$,
	session,
	objutils
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
	function objsearch(k){
		if(k==null||k.length==0)return;
		var pbuf=[];
		var max=8192;
		var maxr=25;
		var idx=0;
		var rdx=0;
		var search=k;//"main";
		try{
			objutils(obj,function(pth,o){
				if(max!=-1){
					if(idx>max)throw('done');
					idx++;
				}
				return pth[pth.length-1].toLowerCase().indexOf(search.toLowerCase())>-1;
			}.bind(this),function(pth,o){
				pbuf.push(pth.join(".").split("."));
				console.log(pth.join("."));
				if(maxr!=-1){
					if(rdx>maxr)throw('done');
					rdx++;
				}

			}.bind(this));
		}catch(e){}
		console.log("-".repeat(8));
		return pbuf;
	};
	$(document).ready(function(){
		$.expr[":"].contains = $.expr.createPseudo(function(arg) {
			return function( elem ) {
				return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
			};
		});
		var idx=0;
		var kbdbuf=[];
		var fnbuf={
			"/":(function(){
				var div=$("<div/>");
				div.css({
					"width":"auto",
					"text-align":"right",
					"position":"fixed",
					"padding":"4px",
					"border-radius":"4px",
					"margin":"4px",
					"background":"var(--accent-color)",
					"right":"0px",
					"top":"0px",
				});
				var input=$("<input/>")
				input.css({
					background:"#FFFFFF",
					padding:"4px",
				});
				div.append(input);
				var results=$("<div/>")
				div.append(results);
				//$("body").append(div);
				//div.hide();
				input.on("keyup",function(e){
					kbdbuf=[];
					if(e.key=="Escape"){
						input.blur();
					}else if(e.key=="Enter"){
						input.blur();
						var cmd=input.val().split(" ")[0];
						var args=input.val().split(" ").slice(1);
						if(typeof(fnbuf[cmd])=="function")
							try{
								fnbuf[cmd].apply(this,args)
							}catch(e){
								console.error(e);
						}else{
							var els=$("a");
							var el=els.find("selected");
							els.removeClass("selected");
							var el=$("a:contains("+input.val()+")");
							if(el.length==0)return;
							el.first().addClass("selected").focus();
							$('html, body').animate({ scrollTop:el.offset().top-100 }, 10);
						};
					}else{
						var term=input.val();
						var r=objsearch(term);
						if(r!=null&&r.length>0){
							results.show();
							results.empty();
							var ul=$("<div/>");
							ul.css({"background":"#FFFFFF","padding":"8px","color":"#000000","font-family":"monospace"});
							r.forEach(function(v){
								var txt=v.filter(function(v){return v[0]!="/"}).join(".")
								var maxlen=24;
								if(txt.length>maxlen)txt=txt.substring(txt.length-maxlen,txt.length);
								ul.append($("<div/>").text(txt));
							}.bind(this));
							results.append(ul);
						}else{
							results.hide();
						}
						var els=$("a");
						els.removeClass("selected");
						var el=$("a:contains("+term+")").first();
						if(el.length==0)return;
						el.addClass("selected");
						$('html, body').animate({ scrollTop:el.offset().top-100 }, 10);
					}
				}.bind(this));
				input.on("blur",function(e){
					div.detach();//div.remove();//div.hide();
				});
				return function(){
					$(document.body).append(div);
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
			"vcxz":function(){console.log("cmd5");},
			"theme":(function(arg){
				session
				var tbuf=[
					"./scribbler-global-dark.css",
					"./scribbler-global-light.css"
				];
				var tidx=0;
				function set_theme(arg){
					$(document).ready(function(){
						var t;
						if(arg){
							if(arg.endsWith(".css"))t=arg;else
							t=["./scribbler-global-",arg,".css"].join("");}
						else{
							tidx++;
							if(tidx>=tbuf.length)tidx=0;
							t=tbuf[tidx]
						}
						session.data.theme=t;
						session.save();
						$("#theme_css").attr("href",t);
					}.bind(this));
						
				};
				if(session.data.theme!=null)set_theme(session.data.theme);
				return set_theme;
				
			})()
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
						try{
							fnbuf[bufln]();
						}catch(e){console.error(e.toString())};
						kbdbuf=[];
					}
				}else{
					kbdbuf=[];
				}
			}else{
				kbdbuf=[];
			}
			/*
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
			*/
		});
	});
	module.exports={};
});
