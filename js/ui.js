define([
	"module",
	"jquery",
	"api/parsing",
	"text!frag/ov.html"
],function(
	module,
	_$,
	parsing,
	frag_ov
){
	$=_$.noConflict();
	var render=function(options){
		options=typeof(options)=="object"?options:{};
		if(options.target==undefined)throw("ETGT");
		if(options.root==undefined)throw("EDATA");
		options.data=typeof(options.data)=="undefined"?options.root:options.data;
		if(options.template==undefined)options.template=frag_ov
		var legendUnparsed=options.root["/legent"];
		var legend={
			package_contents:"/",//todo:read or default
			scope_global:legendUnparsed["/scope-global"],//todo:read or default
			scope_local:legendUnparsed["/scope-local"],//todo:read or default
			inherits:legendUnparsed["/inherits"],//todo:read or default
			returns:legendUnparsed["/returns"],//todo:read or default
			parameters:"parameters",//todo:read or default
			type:"type",//todo:read or default
			owner:"owner",//todo:read or default
			comments:legendUnparsed["/comments"],//todo:read or default
			fields:legendUnparsed["/fields"],//todo:read or default
			methods:legendUnparsed["/methods"],//todo:read or default
			package_paths:legendUnparsed["/package-paths"]//todo:read or default
		};
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
									legend:legend,
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
			$(options.target).find("a").click(function(tgt){
				var id=$(this).attr("id")
				var template=$(this).data("template");
				if(!template){
					if(id==""||id==null)return;
					if(id==".."){
						console.log("A");
						render(
							options.parent
						);
						return;
					}
					if(id.startsWith("_.")){
						console.log("B");
						id=id.substring(2);
						render({
							parent:options,
							target:options.target,
							isdetailedview:true,
							root:options.root,
							data:options.data._[id]
						});
					}else{
						console.log("C");
						render({
							parent:options,
							target:options.target,
							root:options.root,
							data:options.data[id]
						});
					}
				}else{
					require(["text!"+template],function(template){
						if(typeof(template)=="undefined"||template==null){
							throw("ETPL");
						}
						if(id==""||id==null)return;
						if(id==".."){
							console.log("D");
							render(
								options.parent
							);
							return;
						}
						if(id.startsWith("_.")){
							console.log("E");
							id=id.substring(2);
							render({
								parent:options,
								target:options.target,
								isdetailedview:true,
								data:options.root._[id],
								template:template
							});
						}else{
							console.log("F");
							render({
								parent:options,
								target:options.target,
								data:options.root[id],
								template:template
							});
						}
					});
				}
			});
	};
	module.exports=render;
});
