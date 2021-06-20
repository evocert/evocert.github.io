define(["module","./parsing"],function(module,parsing){
	module.exports=function(options){
		options=typeof(options)=="object"?options:{};
		if(typeof(options.src)!="string")throw("ESRC");
		if(typeof(options.path)!="string")throw("EPATH");
		if(typeof(options.root)!="object")throw("EROOT");
		var src=options.src;
		package={};
		package.path=options.path;
		package.name=(function(){
			var ret=null;
			try{src.split("\n").forEach(function(ln){
				if(ret!=null)throw("done");
				ln=ln.trim();
				if(ln.startsWith("package"))
					ret=ln.split("").reverse().join("").split(" ")[0].split("").reverse().join("");
			}.bind(this))}catch(e){};
			return ret;
		})();
		//var pathcomps=options.path.substring(options.path.length+1).split("/");
		var pathcomps=options.path.split("/");
		pathcomps.pop();//fnam
		//var holder={};
		//pathcomps[pathcomps.length-1]=_.package.name
		var objcur=options.root;
		pathcomps.forEach(function(comp,compidx){
			if(objcur[comp]==null)objcur[comp]={};
			objcur=objcur[comp];
		});
		objcur.package=package;
		var _={};
		objcur._=_;
		var prvpas=null;
		{//type
			var out=[];
			var curstruct=null;
			var parse_options={
				beglbl:function(){return 'type '},
				endlbl:function(){return ' {\n'},
				startParsing:function(){},
				trimactive:false,
				flushpassive:function(val){
					prvpas=val;
					if(curstruct!=null){
						var attrbuf=[];
						try{val.split("\n").forEach(function(ln){
							if(ln=="}")throw("done");
							attrbuf.push(ln);
						}.bind(this));}catch(e){}
						curstruct.members={};
						attrbuf.forEach(function(ln){
							ln=ln.trim();
							curstruct.members[ln.split(" ")[0]]=ln.split("").reverse().join("").split(" ")[0].split("").reverse().join("");
						}.bind());
						curstruct=null;
					}
				},
				flushactive:function(structln,fnidx){
					structln=structln.trim();
					var docs=[];
					bufcmt=[];
					try{prvpas.split("\n").reverse().forEach(function(pasln,paslnidx){
						if(pasln=="")return;
						if(pasln.trim().startsWith("//")){
							bufcmt.push(pasln.substring(2));
						}else{throw("done");}
					}.bind(this));}catch(e){};
					var structdata={};
					try{structdata.ident=structln.split(" ")[0];}catch(e){structdata.ident="error: "+e.toString();}
					try{structdata.base=structln.split(" ").reverse()[0];}catch(e){structdata.base="error: "+e.toString();}
					prvpas=null;
					docs=bufcmt.reverse().join("\n");
					_[structdata.ident]={
						//"original_line":"func "+structln,
						"type":"type",
						"ident":structdata.ident,
						"base":structdata.base,
						"docstring":docs
					};
					curstruct=_[structdata.ident];
				},
				evalactive:function(src){}
			};
			parsing(parse_options,src);
		}
		{//func
			var out=[];
			var parse_options={
				beglbl:function(){return 'func '},
				endlbl:function(){return ' {\n'},
				startParsing:function(){},
				trimactive:false,
				flushpassive:function(val){
					prvpas=val;
				},
				flushactive:function(fnln,fnidx){
					fnln=fnln.trim();
					var docs=[];
					bufcmt=[];
					try{prvpas.split("\n").reverse().forEach(function(pasln,paslnidx){
						if(pasln=="")return;
						if(pasln.trim().startsWith("//")){
							bufcmt.push(pasln.substring(2));
						}else{throw("done");}
					}.bind(this));}catch(e){};
					var fndata={};
					if(fnln.startsWith("(")){
						try{fndata.ident=fnln.split(")")[1].split("(")[0].trim();}catch(e){fndata.ident="error: "+e.toString();}
						try{fndata.struct=fnln.split("(")[1].split(")")[0].split(" ")[1].substring(1);}catch(e){fndata.struct="error: "+e.toString();}
						try{fndata.params={};}catch(e){fndata.params="error: "+e.toString();}
						try{fnln.split("(")[2].split(")")[0].trim().split(",").forEach(function(param,paramidx){
							param=param.trim();
							try{fndata.params[param.split(" ")[0]]=param.split(" ")[1]}catch(e){}
						}.bind(this));;}catch(e){}
					}else{
						fndata.ident=fnln.split("(")[0].trim();
						fndata.params={};
						fnln.split("(")[1].split(")")[0].trim().split(",").forEach(function(param,paramidx){
							param=param.trim();
							fndata.params[param.split(" ")[0]]=param.split(" ")[1]
						}.bind(this));;
					}
					fnln=fnln.split("").reverse().join("");
					if(fnln.startsWith(")")){
						fndata.return=fnln.split("(")[0].split("").reverse().join("").split(")")[0].split(" ")[1];
					}else{
						fndata.return=fnln.split(" ")[0].split("").reverse().join("");
					}
					fnln=fnln.split("").reverse().join("");
					prvpas=null;
					docs=bufcmt.reverse().join("\n");
					_[fndata.ident]={
						//"original_line":"func "+fnln,
						"type":"func",
						"ident":fndata.ident,
						"return":fndata.return,
						"struct":fndata.struct,
						"params":fndata.params,
						"docstring":docs
					};
				},
				evalactive:function(src){}
			};
			parsing(parse_options,src);
		}
		/*
		var path=[];
		(function(obj,undefined){//patc
			//println(path.join("."));
			if(obj==undefined||obj==null)return;
			var self=arguments.callee;
			_println=function(){};//println;
			_println=println;
			Object.keys(obj).forEach(function(k){
				this.pathobj=typeof(this.pathobj)=="undefined"?obj[k]:this.pathobj;
				if(k=="")return;
				//path.push(k);
				if(k=="package"){
					//_println("P");
					if(this.parentk!=obj[k].name){
						//_println("PK:"+this.parentk);
						_println("PTH:"+path.join("."));
						pathpnt=path.slice(0,path.length-2);
						//_println("PTHPNT:"+pathpnt);
						//_println("NEWNAM:"+obj[k].name);
						var newname=obj[k].name;
						//_println(typeof(eval("options.root"+path.join("."))));
						var cur=options.root;
						try{path.forEach(function(k,kidx){
							if(cur){
								if(kidx==path.length-1){
									_println(">>"+k+"<"+newname);
									cur[newname]=cur[k];
									//delete(cur[path.pop()]);
									path.pop();
									path.push(newname)
									throw("done");
								}else{
									_println(">"+k);
									cur=cur[k];
								}
							}
						}.bind(this));}catch(e){}
					}
					//_println("//P");
				}else if(typeof(obj[k])=="object"&&k!="package"&&k!="_"){
					path.push(k);
					self(obj[k]);
					//path.pop();
				}
			}.bind(this));
			//println(JSON.stringify(obj));
		})(options.root);//print("|");
		*/
	}
});
