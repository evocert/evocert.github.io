require({
	paths:{
		"jquery":"./js/jquery"
	},
	shim:{
		"jquery":{
			"exports":"jQuery"
		}
	}
},[
	"module",
	"jquery",
	"./api/parsedoc.js",
	"./js/kbd",
	"./js/ui"
],function(
	module,
	_$,
	parsedoc,
	kbd,
	ui
){
	$=_$.noConflict();
	window.buildClient=function(){
		var obj={};
		//https://stackoverflow.com/questions/24705401/jquery-ajax-with-array-of-urls
		//$.get("./api/?cmd=ls",function(files){
		var base="https://raw.githubusercontent.com/evocert/kwe/main/";
		$.getJSON(base+"gendocs/codelist.json",function(files){
			$.when.apply($,files.map(function(url){return $.ajax(base+url);})).done(function(){
				var results=[];
				for(var i=0;i<arguments.length;i++){
					results.push(arguments[i][0]);
				}
				var t0=new Date();
				results.forEach(function(response,responseidx){
					var root=files[responseidx];
					while(root[root.length-1]=="/"&&root.length>0)root.pop();
					while(root[0]=="/"&&root.length>0)root=root.substring(1);
					var src=response;
					console.log("Processing "+root);
					var path=root;//e.AbsolutePath();
					parsedoc({src:src,path:path,root:obj});
				}.bind(this))
				var t1=new Date();
				obj.meta={};
				obj.meta.dur=(t1-t0)/1000+" seconds";
				$("#output").text(JSON.stringify(obj,0,2))
				ui({target:$("#output"),data:obj});
			}.bind(this));
		});
		window.obj=obj;
	};
	window.buildClient();
});
