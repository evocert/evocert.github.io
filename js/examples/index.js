require({
	paths:{
		"jquery":"./js/jquery",
		"text":"./js/require.text",
		"frag":"./frag",
	},
	shim:{
		"jquery":{
			"exports":"jQuery"
		}
	}
},[
	"module",
	"jquery",
	"api/parsing",
	"./js/request",
	"./js/showdown.min",
	"text!frag/examples.html"
],function(
	module,
	_$,
	parsing,
	r,
	showdown,
	frag_examples
){
	$=_$.noConflict();
	var render=function(options){

		options=typeof(options)=="object"?options:{};
		if(options.target==undefined)throw("ETGT");
		if(options.root==undefined)throw("EDATA");
		options.data=typeof(options.data)=="undefined"?options.root:options.data;
		if(options.template==undefined)options.template=frag_examples
		$(options.target).text(typeof(parsedoc));
		var src="";
		parsing(
			{
				beglbl:"[[",
				endlbl:"]]",
				data:options.data,
				//legend:legend,
				print:function(val){},
				evalactive:function(script,content){
					var ctx={};
					print=function(val){
						parsing(
							{
								beglbl:"{{",
								endlbl:"}}",
								data:options.data,
								flushpassive:function(val,idx){
									src+=val;
								},
								flushactive:function(val,idx){
									try{src+=(eval("(function(){return "+val+";})")).call(ctx);}catch(e){src+="[!"+e.toString()+"!]";}
								}.bind(ctx)
							},
							val
						);
					}
					eval("(function(){"+script+"})").call(ctx);
				},
			},
			options.template
		);
		options.target.html(src)
		$(".md").toArray().forEach(function(el){
			var converter = new showdown.Converter();
			var md=$(el).text()
			var html = converter.makeHtml(md);
			$(el).html(html)
		}.bind(this));
	};
//http://localhost:8081/evocert.github.io/examples.html?jsondata=http://localhost:8081/kweexamples/docgen/data.json
	$(document.body).ready(function(){
		if(r.tojson().parameters.jsondata){
			$.getJSON(r.tojson().parameters.jsondata,function(obj){
				render({target:$("#output"),root:obj});
				render({target:$("#output"),root:obj});
			});
		}else{
			$.getJSON("https://raw.githubusercontent.com/evocert/kweexamples/main/docgen/data.json",function(obj){
				render({target:$("#output"),root:obj});
			});
		}

	}.bind(this));
});
