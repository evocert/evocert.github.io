define(["module"],function(module){
	var R=function(){};
	R.prototype.initialize=function(){};
	R.prototype.parameters=(function(){
		var parameters={}
		request.Parameters().StandardKeys().forEach(function(k){
			parameters[k.toLowerCase()]=request.Parameters().StringParameter(k);
		});
		return parameters;
	})();
	R.prototype.headers=(function(){
		var headers={};
		request.RequestHeaders().forEach(function(k){
			headers[k]=request.RequestHeader().Get(k)
		});
		return headers;
	})();
	R.prototype.body=(function(){
		return request.RequestBodyS();
	})();
	R.prototype.body=(function(){
		return request.ProtoMethod();
	})();
	R.prototype.data=function(){
		var _this=this;
		var ret={};
		Object.keys(this.parameters).forEach(function(k){
			//header keys capital...remember
			ret[k.toLowerCase()]=_this.parameters[k]
		});
		Object.keys(ret).forEach(function(k){
			try{
				if(
					typeof(ret[k])=='string'&&
					(
						ret[k][0]=="{"||
						ret[k][0]=="["
					)
				){
					var json=JSON.parse(ret[k]);
					ret[k]=json;
				}else{
				}
			}catch(e){
				console.log("failed parsing json url argument: "+e.toString());
			}
		});
		//add/overwrite json body
		//if(this.headers["Content-type"].indexOf("application/json")==0||
		//   this.headers["Content-Type"].indexOf("application/json")==0
		//){
			try{
				var obj=JSON.parse(this.body);
				Object.keys(obj).forEach(function(k){
					ret[k]=obj[k]
				});
			}catch(e){
			}
		//}
		return ret;
	};
	R.prototype.files=(function(){
				var ret=[];
				request.Parameters().FileKeys().forEach(function(k){
					ret.push({
						key:k,
						value:request.Parameters().StringParameter(k)
					});
				});
				return ret;
	})();
	R.prototype.tojson=function(){
		return {
			parameters:this.parameters,
			files:this.files,
			headers:this.headers,
			method:this.method,
			body:this.body
		}
	};
	module.exports=new R();
});
