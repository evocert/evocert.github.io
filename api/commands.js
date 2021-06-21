define(["module","./request.js"],function(module,r){
	var data=r.data();
	var cmd={
		editconnection:function(){
			var id=data.alias
			var coninfo=JSON.parse(mqtting.ConnectionInfo(id));
			println(`
				<style>
					#addconnection{
						font-family:monospace;
					}
				</style>
				<div id="addconnection">
					<label>alias....</label><input name="alias"    value="`+coninfo.ClientID+`"  id="alias"></input><br/>
					<label>broker...</label><input name="broker"   value="`+coninfo.broker+`"    id="broker"></input><br/>
					<label>port.....</label><input name="port"     value="`+coninfo.port+`"      id="port"></input><br/>
					<label>user.....</label><input name="user"     value="`+coninfo.user+`"      id="user"></input><br/>
					<label>password.</label><input name="password" value="`+coninfo.password+`"  id="password"></input><br/>
					<button class="alt-s" id="btn0" onClick="postElem(this)" target="#output" url_ref="./api/?cmd=addconnection" form_ref="#addconnection">Save <sup>alt-s</sup></button>
				</div>
			`);
		},
		getconnections:function(){
			println(`<table>`)
			mqtting.Connections().sort().forEach(function(con,conidx){
				var kbdidx=conidx+1;
				var connected=mqtting.IsConnect(con);
				println(`<tr>`);
				println(`<td style="font-weight:bold;padding-left:4px;padding-right:4px;background:`+(connected?"#88CC88":"#888844")+`;color:`+(connected?"#008800":"#CCCC88")+`;">`+con+`</td>`);
				println(`<td><button class="alt-`+kbdidx+`" onClick="postElem(this)" target="#output" url_ref="./api/?cmd=editconnection&alias=`+con+`" form_ref="#addconnection">edit<sup>alt-`+kbdidx+`</sup></button></td>`);
				println(`<td><button style="width:152px;" class="ctrl-`+kbdidx+`" onClick="postElem(this)" target="#output" url_ref="./api/?cmd=`+(connected?"disconnect":"connect")+`&alias=`+con+`" form_ref="#addconnection">`+(connected?"disconnect":"connect")+`<sup>ctrl-`+kbdidx+`</sup></button></td>`);
				println(`<td><button onClick="postElem(this)" target="#output" url_ref="./api/?cmd=removeconnection&alias=`+con+`" form_ref="#addconnection">remove</button></td>`);
				println(`<td><button onClick="postElem(this)" target="#output" url_ref="./api/?cmd=publish&alias=`+con+`">publish</button></td>`);
				println(`<td><button class="ctrl-alt-`+kbdidx+`" onClick="postElem(this)" target="#output" url_ref="./api/?cmd=getsubscriptions&alias=`+con+`">subscriptions <sup>CTRL_ALT-`+kbdidx+`</sup></button></td>`);
				println(`</tr>`);
			});
			println(`</table>`)
		},
		newconnection:function(){

			var alias="new_"+mqtting.Connections().length;
			println(`
				<style>
					#addconnection{
						font-family:monospace;
					}
				</style>
				<div id="addconnection">
					<label>alias....</label><input name="alias"    value="`+alias+`"       id="alias"></input><br/>
					<label>broker...</label><input name="broker"   value="localhost" id="broker"></input><br/>
					<label>port.....</label><input name="port"     value="1883"      id="port"></input><br/>
					<label>user.....</label><input name="user"     value=""          id="user"></input><br/>
					<label>password.</label><input name="password" value=""          id="password"></input><br/>
					<button class="alt-s" id="btn0" onClick="postElem(this)" target="#output" url_ref="./api/?cmd=addconnection" form_ref="#addconnection">Save <sup>alt-s</sup></button>
				</div>
			`);
		},
		addconnection:function(){
			try{
				var id=data.alias;
				var registered=typeof(mqtting.Connections().find(function(k){
					return k==id;
				}.bind(this)))=="string";
				if(!registered){
					mqtting.RegisterConnection(
						data.alias,//id,
						{
							"broker":data.broker,//"localhost",//"skullquake.dedicated.co.za",
							"port":parseInt(data.port),//1883,
							"user":data.user,//"",
							"password":data.password//""
						}
					);
					this.getconnections();
					println("connection registered");
				}else{
					println("already registered");
				}
			}catch(e){
				println(["error",e.toString()].join(":"));
			}

		},
		removeconnection:function(){
			println("stub");
		},
		connect:function(){
			try{
				var id=data.alias;
				if(mqtting.IsConnect(id)){
					println("already connected");
				}else{
					mqtting.Connect(id);
				}

			}catch(e){
				println(["error",e.toString()].join(":"));
			}
			this.getconnections();
		},
		disconnect:function(){
			try{
				var id=data.alias;
				if(mqtting.IsConnect(data.alias)){
					mqtting.Disconnect(id);
				}else{
					println("already disconnected");
				}

			}catch(e){
				println(["error",e.toString()].join(":"));
			}
			this.getconnections();

		},
		publish:function(){
			if(mqtting.IsConnect(data.alias)){
				if(data.alias!=null&&data.topic!=null&&data.payload!=null){
					mqtting.Publish(
						data.alias,
						data.topic,
						0,
						true,
						data.payload
					);
				}else{
				}

				println(`
				<style>
					#publish{
						font-family:monospace;
					}
				</style>
				<div id="publish">
					<p>`+data.alias+`</p>
					<label>topic....</label><input value="`+(data.topic==null?"Topic":data.topic)+`" name="topic" id="topic"></input></br>
					<label>payload..</label><input value="`+(data.payload==null?"Payload":data.payload)+`" name="payload" id="payload"></input></br>
					<button autofocus="true" onClick="postElem(this)" target="#output" url_ref="./api/?cmd=publish&alias=`+data.alias+`" form_ref="#publish">send <sup>ALT+S</sup></button>
				</div>`)
			}else{
				println(`not connected`);
				this.getconnections();
			}
		},
		getsubscriptions:function(){
			println("subscriptions stub");
			println(data.alias);
			println(`<div id="publish">
				<p>`+data.alias+`</p>
				<label>topic....</label><input value="`+(data.topic==null?"Topic":data.topic)+`" name="topic" id="topic"></input></br>
				<label>payload..</label><input value="`+(data.payload==null?"Payload":data.payload)+`" name="payload" id="payload"></input></br>
				<label>qus......</label><input value="`+(data.qos==null?"zrao":data.qos)+`" name="qos" id="qos"></input></br>
				<button class="alt-s" autofocus="true" onClick="postElem(this)" target="#output" url_ref="./api/?cmd=addsubscription&alias=`+data.alias+`" form_ref="#publish">save <sup>alt+s</sup></button>
			</div>`)

		},
		addsubscription:function(){
			println("add subscription stub");println("<br/>");
			println(data.alias);println("<br/>");
			println(data.topic);println("<br/>");
			println(data.payload);println("<br/>");
			println(data.qos);println("<br/>");
//func (mqttmngr *MQTTManager) Subscribe(alias string, topic string, qos byte) (err error) {
		},
		gettopics:function(){
			println(mqtting.ActiveTopics())
		},
	}
	module.exports=cmd;
});

