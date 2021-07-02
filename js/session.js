define([
	"module"
],function(
	module
){
	var k="evocert.github.io";
	var data=null;
	function init(){
		if(!localStorage.getItem(k)){
			data={};
			localStorage.setItem(k,JSON.stringify(data));
		}else{
			data=JSON.parse(localStorage.getItem(k));
		}
		return data;
	}
	function clear(){
		localStorage.removeItem(k);
	}
	function reset(){
		clear();
		init();
	}
	function save(){
		localStorage.setItem(k,JSON.stringify(data));	
	}
	//reset();
	var data=init();
	module.exports={
		data:data,
		init:init,
		clear:clear,
		reset:reset,
		save:save
	};
	window.s=module.exports;
});
