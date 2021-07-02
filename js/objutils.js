define(["module"],function(module){
	//--------------------------------------------------------------------------------
	//map scan utility
	//--------------------------------------------------------------------------------
	var lib=(function(){
		function v(/*object*/o,pr/*predicate*/,cb/*callback*/){
			pr=typeof(pr)=="function"?pr:function(){return false};
			cb=typeof(cb)=="function"?cb:function(){return false};
			var kbuf=[];
			function _v(o){
				if(typeof(o)=="object")
				Object.keys(o).forEach(function(k){
					if(k=="parent")return;
					kbuf.push(k);
					var pth=kbuf;//.join(".");
					if(pr(pth,o[k]))cb(pth,o[k]);
					_v(o[k]);
				});
				kbuf.pop();
			};
			_v(o);
		};
		return{
			visit:v
		}
	})();
	module.exports=lib.visit;
	/*
	{
		var pmap={};
		lib.visit(a,function(pth,o){
			return true;
		},function(pth,o){
			pmap[pth]=o;
		});
		console.log(JSON.stringify(pmap));
	}
	{
		var pbuf=[];
		lib.visit(a,function(pth,o){
			return pth.indexOf("a.b")==0;
		},function(pth,o){
			pbuf.push(pth);
		});
		console.log(JSON.stringify(pbuf));
	}
	*/
});
