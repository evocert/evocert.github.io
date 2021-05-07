<@
console.Log("Configuring endpoints...");
resourcing.RegisterEndpoint("/","./www");

console.Log("COnfiguring databases...");
dbms.RegisterConnection(
        "pg",
        "postgres",
        "user=postgres password=PASSWORD dbname=postgres sslmode=disable"
);

console.Log("Concfiguring schedule...");
var schid="mySchedule";
sch0=channel
.Schedules()
.RegisterSchedule(
    schid,
    {
	"Seconds":60
    },
    request
);
sch0.AddAction(
	(function(args){
		console.Log("Executing "+args.schid);
	}).toString(),
	[{schid:schid}]
);    
sch0.Start();

var PORT=":8081";
channel.Listener().Listen(PORT);
console.Log("Listening on port "+PORT);
@>
