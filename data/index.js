define(["module"],function(module){
	var data={};
	try{
		data={
			meta:{
				title:"KWE",
				description:"A Multiplatform Server",
				github:"https://github.com/evocert",
				download_root:"https://kwe.com/downoads/",
				platforms:{
					"win64":{
						"url":"https://kwe.com/downloads/kwe_win64.exe"
					},
					"linux":{
						"url":"https://kwe.com/downloads/kwe_linux"
					},
					"mac":{
						"url":"https://kwe.com/downloads/kwe_mac"
					},
					"aarch":{
						"url":"https://kwe.com/downloads/kwe_android"
					},
					"src":{
						"url":"https://kwe.com/downloads/kwe.tar.gz"
					}
				},
				features:[
						{
							"title":"Fast & Light",
							"description":"Start your server immediately with no dependencies! No time wasted doing excessive setup"

						},
						{
							"title":"Multiple Platforms",
							"description":"Compiles for WIndows, Linux, Arm, Darwin, etc."
						},
						{
							"title":"Synchronized",
							"description":"Synchronize codebases, databases, and files with other servers over http, websocket and mqtt"
						},
						{
							"title":"Secure",
							"description":"Secure your server from DDOS and other threats by exposing only what you need and using encryption protocols"
						},
						{
							"title":"Configurable",
							"description":"Simple and easy single step configuration with live runtime reconfiguration"
						},
						{
							"title":"Zero Downtime",
							"description":"Never turn off your server. For high load scenarios connect multiple servers to distribute load for even more robustness"
						},
						{
							"title":"Script Everything",
							"description":"Http, Websocket, Mqtt, Configuration, database eventing, schedules"
						},
						{
							"title":"Templated",
							"description":"Built in templating language, mix scripts and templates!"
						},
				],
				changelog:[
					{
						"version":"0.03",
						"date":new Date(),
						"changes":[
							"added json api docs",
							"added general purpose api browser",
						]
					},

					{
						"version":"0.02",
						"date":new Date(),
						"changes":[
							"added features list"
						]
					},
					{
						"version":"0.01",
						"date":new Date(),
						"changes":[
							"added documentation"
						]
					}
				],
				api:{
					modules:{
						templating:{
							description:"Templating allows you to mix script and templates to generate output, switching between active and passive code. Control is provided for loading templates, as well as passing in arguments and obtaining return values from templates.",
							functions:{
								"<@ ... @>":{

      
									dsc:"Active code. Here you can write your scripting code. Anything outside is passive.",
									typ:"Template Capture group",
									arg:[
										{
											nam:"",
											dsc:"Content",
											typ:"JavaScript code"
										}
									]
								},
								"<#path|file{@arg0,arg1,...,argN@}/>":{
									dsc:"Template loading syntax. This is on a relative basis, with | acting as path seperators",
									typ:"Template Capture group",
									arg:[
										{
											nam:"",
											dsc:"Content",
											typ:"JavaScript code"
										}
									]
								},
								"parseEval":{
									dsc:"Evaluate content and parse",
									typ:"function",
									arg:[
										{
											nam:"val",
											dsc:"Content to evaluate and parse",
											typ:"Template code"
										}
									]
								}

							},
						},
						dbms:{
							description:"Database interaction is done through <code>dbms</code>. A transparent API allows you to use DBMS in Go, JavaScript, HTTP Client or WebSocket.",
							functions:{
								concat:{
									dsc:"Concatenats two strings",
									typ:"function",
									ret:"string",
									arg:[
										{
											nam:"a",
											dsc:"first part to concatenate",
											typ:"string"
										},
										{
											nam:"b",
											dsc:"second part to concatenate",
											typ:"string"
										}
									]
								}
							},
							structs:{
								vec2f:{
									dsc:"Two dimensional vector",
									typ:"struct",
									mem:[
										{
											typ:"float",
											nam:"a",
											dsc:"x coordinate"
										},
										{
											typ:"float",
											nam:"b",
											dsc:"y coordinate"
										}
									]
								}
							},
							classes:{
								User:{
									dsc:"Represents a user",
									typ:"class",
									ctor:[
										{
											typ:"string",
											nam:"usr",
											dsc:"user login"
										},
										{
											typ:"string",
											nam:"pas",
											dsc:"user password"
										}
									],
									mem:[
										{
											typ:"string",
											nam:"nam",
											dsc:"user name"
										},
										{
											typ:"string",
											nam:"pas",
											dsc:"user password"
										}
									]
								},
								Session:{
									dsc:"Represents a session",
									typ:"class",
									ctor:[
										{
											typ:"pointer",
											nam:"usr",
											dsc:"pointer to user"
										},
									],
									mem:[
										{
											typ:"function",
											nam:"get_sid",
											dsc:"obtain session id"
										},
										{
											typ:"string",
											nam:"sid",
											dsc:"session id"
										}
									]
								}

							}
						},
						webing:{
							description:"Use <code>webing</code> if you want to make web requests."
						},
						request:{
							description:"Be it an HTTP, WebSocket, or MQTT request, you can use <code>request</code> to obtain crucial information about the current request.",
							functions:{
								Parameters:{
									dsc:"Obtain parameters",
									typ:"function",
									ret:"Object",
									arg:[
									]
								},
								Parameter:{
									dsc:"Obtain specific form/url parameters. Use request.Parameters().Parameter(K)",
									typ:"function",
									ret:"String",
									arg:[
										{
											nam:"key",
											dsc:"Key to look up",
											typ:"string"
										}
									]
								},
								SetResponseHeader:{
									dsc:"Set response header. Do this prior to any other output operations",
									typ:"function",
									ret:"Undefined",
									arg:[
										{
											nam:"a",
											dsc:"first part to concatenate",
											typ:"string"
										},
										{
											nam:"b",
											dsc:"second part to concatenate",
											typ:"string"
										}
									]
								},



							}
						},
						response:{
							description:"Responses to HTTP, WebSocket, or MQTT requests can be generated using <code>response</code>"
						},
						schedule:{
							description:"Schedules can be dynamically created or modified on the fly using <code>schedule</code>"
						},
						websocket:{
							description:"WebSocket are handled with <code>websocket</code>. Simple client or server WebSocket connections can be scripted."
						},
						mqtt:{
							description:"Easy IOT integration with <code>mqtt</code>. You will of course need an <code>mqtt</code> server as well"
						},
						cache:{
							description:"Provides high speed transient data storage, accessible accross all scripting instances",
							functions:{
								find:{
									dsc:"Gets object from map",
									typ:"function",
									ret:"object",
									arg:[
										{
											nam:"key",
											dsc:"Key to look up. May be string or array of strings",
											typ:"string|array"
										},
									]
								},
								put:{
									dsc:"Puts object into map",
									typ:"function",
									ret:"object",
									arg:[
										{
											nam:"k",
											dsc:"key to look up",
											typ:"string"
										},
										{
											nam:"v",
											dsc:"value to emplace",
											typ:"any"
										},
									]
								},
								delete:{
									dsc:"Deletes value from map",
									typ:"function",
									ret:"object",
									arg:[
										{
											nam:"k",
											dsc:"key to look up",
											typ:"string"
										}
									]
								}
							},

						}
					},
				}
			}
		};
	}catch(e){
		println(e.toString());
	}
	module.exports=data;
});
