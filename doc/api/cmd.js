define(["module","./parsedoc"],function(module,parsedoc){
	module.exports={
		build:function(r){
			console.Log([module.id,"start"].join(":"));
			var t0=new Date();
			var obj={root:{}};
			var root=r.data().path;
			while(root[root.length-1]=="/"&&root.length>0)root.pop();
			_fsutils.FIND(root).filter(function(e){
				return e.Name().endsWith(".go");
			}).forEach(function(e){
				var src=_fsutils.CATS(e.AbsolutePath());
				console.Log("Processing "+e.AbsolutePath());
				var path=e.AbsolutePath();
				parsedoc({src:src,path:path.substring(root.length+1),root:obj});
			}.bind(this));
			//request.ResponseHeader().Set("Content-Type","application/json");
			var t1=new Date();
			obj.meta={};
			obj.meta.dur=(t1-t0)/1000+" seconds";
			print(JSON.stringify(obj,0,2));
			console.Log([module.id,"end"].join(":"));
		},
		ls:function(r){
			var base="./www"
			var root=base+"/docgen/kwe";
			while(root[root.length-1]=="/"&&root.length>0)root.pop();
			var ret=[];
			_fsutils.FIND(root).filter(function(e){
				return e.Name().endsWith(".go");
			}).forEach(function(e){
				ret.push(e.AbsolutePath().substring(base.length));
			}.bind(this));
			request.ResponseHeader().Set("Content-Type","application/json");
			print(JSON.stringify(ret));
		}
	}
});
