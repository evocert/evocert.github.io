define([
	"module",
	"jquery",
	"api/parsing",
],function(
	module,
	_$,
	parsing
){
	$=_$.noConflict();
	var render=function(options){
		options=typeof(options)=="object"?options:{};
		if(options.target==undefined)throw("ETGT");
		if(options.data==undefined)throw("EDATA");
		$(options.target).text(typeof(parsedoc));
			var src="";
			parsing(
				{
					beglbl:"[[",
					endlbl:"]]",
					data:options.data,
					//trimactive:false,
					//flushpassive:function(val,idx){},
					//flushactive:function(val,idx){//tmpcode+=val;},
					print:function(val){},
					evalactive:function(script,content){
						//console.log(script);
						var ctx={};
						print=function(val){
							//src+=val;
							parsing(
								{
									beglbl:"{{",
									endlbl:"}}",
									data:options.data,
									//trimactive:false,
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
						//console.log(ctx);

					},
				},
				`
[['use strict';]]
<style>
	.muted{
		color:#888888;
	}
</style>
[[if(options.parent){]]
<a href="#" id=".." class="back">--back--</a></br>
[[}else{]]
<a href="#">--root--</a></br>
[[}]]
[[try{]]
	[[if(!options.isdetailedview){]]

		[[if(options.data.package){]]
		<h3>Package</h3>
		<div><span class="muted">--<span/> name&gt; {{options.data.package.name}}</div>
		<div><span class="muted">--<span/> path&gt; {{options.data.package.path}}</div>
		[[}]]

		<h3>Sub Packages</h3>
		[[Object.keys(options.data).forEach(function(_k){
			if(_k=="_")return;
			if(_k=="package")return;
			this.k=_k;
		]]
			<div><a href="#" id="{{this.k}}"><span class="muted">--</span> {{this.k}} <span class="muted">--</span></a></div>
		[[}.bind(this));]]

		[[if(options.data._){]]
		<h3>Details</h3>
		[[Object.keys(options.data._).forEach(function(_k){
			this.k=_k;
		]]
			<div><a href="#" id="_.{{this.k}}"><span class="muted">--</span>{{this.k}} <span class="muted">--</span></span></a></div>
			<div><span href="#" id="_.{{this.k}}"><span class="muted">--- type --</span> 
				<span
					[[switch(options.data._[_k].type){
						case"func":
							]]style="color:#88FF88"[[
							break;
						case"type":
							]]style="color:#FF8888"[[
							break;
						default:
							break;
					}]]
				>
					[[print(options.data._[_k].type);]]
				</span>
					<span class="muted">--</span></span></div>
			<div><span href="#" id="_.{{this.k}}"><span class="muted">-- ident --</span> [[print(options.data._[_k].ident);]] <span class="muted">--</span></span></div>
			<div><span href="#" id="_.{{this.k}}"><span class="muted">---- doc --</span> <span style="color:#CC8888;">[[print(options.data._[_k].docstring);]]</span> <span class="muted">--</span></span></div>
		[[}.bind(this));]]
		[[}]]
	[[}else{]]
		<h3>Details</h3>
		[[Object.keys(options.data).forEach(function(_k){
			this.k=_k;
		]]
			<div><a href="#" id="_.{{this.k}}">--{{this.k}}--</a></div>
			[[if(typeof(options.data[_k])=="string"){]]
				<div>...<span class="muted">--</span>[[print(options.data[_k]);]]<span class="muted">--</span></div>
			[[}else{]]
				[[Object.keys(options.data[_k]).forEach(function(_k0){]]
					<div>...<a href="#" id="[[print(_k0);]]"><span class="muted">--</span>[[print(_k0);]]<span class="muted">--</span></a></div>
				[[}.bind(this));]]
			[[}]]
		[[}.bind(this));]]
	[[}]]
[[}catch(e){
	print("--"+e.toString()+"--");
}]]
				`
			);
			options.target.html(src)
			$(options.target).find("a").click(function(tgt){
				var id=$(this).attr("id")
				if(id==""||id==null)return;
				if(id==".."){
					render(options.parent);
					return;
				}
				if(id.startsWith("_.")){
					id=id.substring(2);
					render({parent:options,target:options.target,isdetailedview:true,data:options.data._[id]});
				}else{
					render({parent:options,target:options.target,data:options.data[id]});
				}
			});
	};
	module.exports=render;
});
