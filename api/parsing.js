!(function(name,context,definition){if(typeof exports==='object'){module.exports=definition(require);}else if(typeof define==='function'&&define.amd){define(definition); }else{context[name]=definition();}
}).call(this,'parseActivePassive',this,function(require){
    function parseActivePassive(options,unparsedcontent){

        function calloptions(){
            if (typeof options==="function") {
                return options();
            } 
            return options;
        }

	    if (typeof calloptions().startParsing === "function") {
		    calloptions().startParsing();
	    }

        var trimcode=(typeof calloptions().trimactive === "boolean")?calloptions().trimactive:true;

	    var passive="";
        var unsprsdln=-1;
        var psvprsdi=-1;
        var atvprsdi=-1;
	    var canprintout=typeof calloptions().print === "function";
	    var owner=typeof calloptions().owner === "object" ? calloptions().owner:null;
	    var print=function(prntthis) {
            if (canprintout && typeof prntthis === "string" && prntthis!=="") {
                passive+=prntthis;
            }       
	    }
        var altFlushPassive=typeof calloptions().flushpassive === "function"?calloptions().flushpassive:null;
        var altFlushPassiveResult=null;
        var altFlushActive=typeof calloptions().flushactive === "function"?calloptions().flushactive:null;
        var altFlushActiveResult=null;
        var altEvalActive=typeof calloptions().evalactive === "function"?calloptions().evalactive:null;
        var stillvalid=true;

	    function iterateString(prsgn,stringtoiterate,functoprsr) {
            if (stillvalid && stringtoiterate!=null) {
                if (typeof stringtoiterate==="string" && typeof functoprsr === "function") {
                    for(var i=0;i<stringtoiterate.length;i++) {
                        unsprsdln++
                        functoprsr(prsgn,stringtoiterate[i]);
                        if (!stillvalid) break;
                    }
                } else if (typeof stringtoiterate === "function") {
                    var tmpstringtoiterate=null;
                    while(stillvalid){
                        if((tmpstringtoiterate=stringtoiterate())!=null && typeof tmpstringtoiterate === "string") {
                            for(var i=0;i<tmpstringtoiterate.length;i++) {
                                unsprsdln++
                                functoprsr(prsgn,tmpstringtoiterate[i]);
                                if (!stillvalid) break;
                            }
                        } else {
                            break;
                        }
                    }
                }
            }
	    }

	    var foundCode=false;
	    var hasCode=false;
	    var tmppassive="";
	    var tmpcode="";
	    var code="";
	    var prvc="";
	    var begi=0;
	    var endi=0;
	    var content=[];

	    if (typeof calloptions().beglbl!=="string" && typeof calloptions().beglbl!=="function") {
		    calloptions()["beglbl"]="[@";
	    }

	    if (typeof calloptions().endlbl!=="string" && typeof calloptions().endlbl!=="function") {
		    calloptions()["endlbl"]="@]";
	    }

	    function flushPassive(options){
            if (tmppassive!="") {
                if (altFlushPassive!=null && typeof altFlushPassive === "function") {
                    if((altFlushPassiveResult=altFlushPassive(tmppassive,psvprsdi))!=null && typeof altFlushPassiveResult ==="boolean" && altFlushPassiveResult===false){
                        stillvalid=false;
                    }
                } else { 
                    if(foundCode) {
                        if (tmppassive.length>1 && tmppassive.startsWith("`") && tmppassive.endsWith("`")) {
                            tmpcode+="print("+tmppassive+");";                    
                        } else {
                            var cntntl=content.push(tmppassive+"");
                            tmpcode+="print(content["+(cntntl-1)+"]);";
                        }                
                    } else {
                        print(tmppassive)
                    }
                }
                if (psvprsdi>-1) {
                    psvprsdi=-1;
                }
                tmppassive="";
            }
	    }

	    function parsePsvChar(options,chr) {
            flushCode(options);
            tmppassive+=chr;
	    }

	    function parseCodeChar(options,chr) {
            if(!hasCode) {
                if (trimcode && (chr+"").trim()!=="") {
                    hasCode=true;
                } else {
                    hasCode=true;
                }
            }
            if (hasCode) {
                flushPassive(options)
                if (!foundCode) {
                foundCode=true;
                }
                tmpcode+=chr;
            }
	    }

	    function flushCode(prsgn){
            if(tmpcode!="") {
                if (altFlushActive!=null && typeof altFlushActive === "function") {
                    if((altFlushActiveResult=altFlushActive(tmpcode,atvprsdi))!=null && typeof altFlushActiveResult ==="boolean" && altFlushActiveResult===false){
                        stillvalid=false;
                    }                    
                } else {
                    code+=tmpcode;
                }
                if(atvprsdi>-1) {
                    atvprsdi=-1;
                }
                tmpcode="";
            }
	    }

        function beglbl(options) {
            if (typeof options.beglbl=== "function") {
                return options.beglbl()
            }
            return options.beglbl;
        }

        function endlbl(options) {
            if (typeof options.endlbl=== "function") {
                return options.endlbl()
            }
            return options.endlbl;
        }
	    
	    function parsechr(options,chr) {
            if (endi==0 && begi<beglbl(options).length) {
                if (psvprsdi==-1) {
                    psvprsdi=unsprsdln;
                }
                if (begi>0 && beglbl(options)[begi-1]==prvc && beglbl(options)[begi]!==chr) {
                var bi=begi;
                begi=0;
                iterateString(options,beglbl(options).substring(0,bi),parsePsvChar);
                }
                if (beglbl(options)[begi]===chr) {
                begi++;
                if (begi===beglbl(options).length){
                    prvc="";
                    prvc="";
                } else {
                    prvc=chr;
                }
                } else {
                if (begi>0) {
                    var bi=begi;
                    begi=0;
                    iterateString(options,beglbl(options).substring(0,bi),parsePsvChar);
                }
                parsePsvChar(options, prvc=chr);
                }
            } else if (begi==beglbl(options).length && endi<endlbl(options).length) {
                if (atvprsdi==-1) {
                    atvprsdi=unsprsdln;
                }
                if (endlbl(options)[endi]===chr) {
                    endi++;
                        if (endi===endlbl(options).length){
                            begi=0;
                            endi=0;
                            prvc="";
                        }
                } else {
                    if (endi>0) {
                        var bi=endi;
                        endi=0;
                        iterateString(options,endlbl(options).substring(0,bi),parseCodeChar);
                    }
                    parseCodeChar(options, chr);
                }
            }
        }

	    iterateString(calloptions(),unparsedcontent,parsechr);
	    
	    flushPassive(calloptions()); 
	    flushCode(calloptions());
	    if (foundCode && code!="") {
            if (altEvalActive!=null && typeof altEvalActive === "function") {
                //altEvalActive(code);
                altEvalActive(code,content);
            } else {
		    //console.log(code);
		        eval(code);
            }
	    }         

	    if (passive!=="") {
            if (canprintout){
                calloptions().print(passive);
            }
	    }

	    if (typeof calloptions().endParsing === "function") {
		    calloptions().endParsing();
	    }
	}
	return parseActivePassive;
});
