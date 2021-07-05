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

	var render=function(opts){
		opts=typeof(opts)=="object"?opts:{};
		if(opts.target==undefined)throw("ETGT");
		opts.data=typeof(opts.data)=="undefined"?opts.root:opts.data;
		if(opts.template==undefined)opts.template=frag_examples
		opts.target.empty();
		var src="";
		opts.beglbl="[[";
		opts.endlbl="]]";
		opts.print=function(val){if(typeof(val)=="undefined")return;src+=val;};
		/*
		beglbl:"[[",
			endlbl:"]]",
			data:options.data,
			//legend:legend,
			print:function(val){},
		*/
		opts.evalactive=function(script,content){
			var ctx={};
			print=function(val){
				parsing(
					{
						beglbl:"{{",
						endlbl:"}}",
						data:opts.data,
						showdown:showdown,
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
		};
		var prsng=opts
		parsing(
			opts,
			opts.template
		);
		var nod=$("<div/>").html(src)
		var srcbuf=[];
		var scripts=nod.find("script");
		scripts.each(function(){
			srcbuf.push($(this).text());
		});
		scripts.remove();
		//opts.target.append(nod);
		nod.children().appendTo(opts.target);
		srcbuf.forEach(function(src){
			eval(src);
		}.bind(this));
		$(opts.target).find("a").click(function(tgt){
			var id=$(this).attr("id")
			var template=$(this).data("template");
			var context=$(this).data("context");
			if(template){
				require(["text!"+template],function(template){
					if(typeof(template)=="undefined"||template==null){
						throw("ETPL");
					}
					{
						opts.target.empty();
						var optsclone={};
						Object.keys(opts).forEach(function(k){optsclone[k]=opts[k]});
						optsclone.template=template;
						if(typeof(context)!="object"){try{context=JSON.parse(context);}catch(e){}}
						if(typeof(context)=="object"){
							Object.keys(context).forEach(function(k){optsclone[k]=context[k]});
						}
						optsclone.parent=this;
						render(optsclone);
					}
				});
			}
		});
	};

//http://localhost:8081/evocert.github.io/examples.html?jsondata=http://localhost:8081/kweexamples/docgen/data.json
	$(document.body).ready(function(){
		if(r.tojson().parameters.jsondata){
			$.getJSON(r.tojson().parameters.jsondata,function(obj){
				render({target:$("#output"),data:obj,template:frag_examples});
				render({target:$("#output"),data:obj,template:frag_examples});
			});
		}else{
			$.getJSON("https://raw.githubusercontent.com/evocert/kweexamples/main/docgen/data.json",function(obj){
				render({target:$("#output"),data:obj,template:frag_examples});
			});
		}
	}.bind(this));
});
