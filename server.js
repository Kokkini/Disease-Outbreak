//Using express to simplify handling of different client reqs
var express = require('express');
var http = require('http');
var app = express();
var fs = require('fs');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//import the calculator module
var calc = require('./calculator');
var c = new calc();

//import the weather module
var WeatherController = require('./weather');
var wc = new WeatherController();

//google trends
const googleTrends = require('google-trends-api');

const sleep = (milliseconds) => {
	  return new Promise(resolve => setTimeout(resolve, milliseconds))
	}

function getAverage(timelineData){
	if(timelineData.length == 0) return 0;
	// console.log(timelineData);
	var sum = 0;
	for (i = 0; i < timelineData.length; i++) {
		sum += timelineData[i].value[0];
		// console.log(timelineData[i].value[0]);
	}
	return 1.0*sum/timelineData.length;
}

function getPeakDates(timelineData, peakParam=2.5){
	var avg = getAverage(timelineData);
	var std = getSTD(timelineData);
	// console.log("avg:"+avg.toString());
	// console.log("std:"+std.toString());
	var peakDates = [];
	for (i = 0; i < timelineData.length; i++) {
		if (timelineData[i].value[0] > avg + peakParam*std){
			peakDates.push(timelineData[i]);
		}
	}
	return peakDates;
}

function getSTD(timelineData){
	if (timelineData.length == 0) return 0;
	var avg = getAverage(timelineData);
	var std = 0;
	for (i=0; i< timelineData.length; i++){
		std += Math.pow((timelineData[i].value[0] - avg), 2);
	}
	std /= timelineData.length;
	std = Math.pow(std, 0.5);
	return std;
}


//refer to local dir, change if moving this script to another dir
app.use(express.static("."));

//send html for calculation page to client
// app.get('/calc', function (req,res){
// 	var html_str = c.render();
// 	console.log("Rendering calculation page");
// 	res.send(html_str);
// })

//process a factorial request
// app.get('/fact', function (req,res){
// 	var seed = req.query.seed;
// 	console.log("Factorial request, seed is " + seed);
// 	//check for valid input
// 	if(seed == ""){
// 		res.send("Enter the seed first!");
// 	}
// 	else if(!isInt(seed)){
// 		res.send("Input not an integer!");
// 	}
// 	else if(seed < 0){
// 		res.send("Input must be positive integer!");
// 	}
// 	else{
// 		//Call the fact function from the module
// 		var result = c.fact(seed);
// 		console.log("Sending factorial result: " + result + "\n");
// 		res.send("The factorial of " + seed + " is " + result);
// 	}
// })

//process a summation request
// app.get('/sum', function (req,res){
// 	var seed = req.query.seed;
// 	console.log("Summation request, seed is " + seed);
// 	//check for valid input
// 	if(seed == ""){
// 		res.send("Enter the seed first!");
// 	}
// 	else if(!isInt(seed)){
// 		res.send("Input not an integer!");
// 	}
// 	else if(seed < 0){
// 		res.send("Input must be positive integer!");
// 	}
// 	else{
// 		//Call the sum function from the module
// 		var result = c.sum(seed);
// 		console.log("Sending summation result: " + result + "\n");
// 		res.send("The summation of " + seed + " is " + result);
// 	}
// })

//send html for weather page to client
app.get('/weather', function (req,res){
	var html_str = wc.render();
	console.log("Rendering weather page");
	res.send(html_str);
})

//send weather forecast data as html to client
app.post('/getWeather', async function (req,res){
	//first obtain zip from wunderground
	// wc.once('zipEvent', function(zip){
	// 	//with zip, request forecast data from wunderground
	// 	wc.once('forecastEvent', function(msg){
	// 		res.send(msg);
	// 	});
	// 	wc.getWeather(zip);
	// });
	// wc.getZip();


	var jsonData = req.body;
	console.log(jsonData);
	for (var string in jsonData){
		console.log('');
	}
	console.log(string);
	var obj = JSON.parse(string);
	console.log(obj);

	// var userFile = fs.readFileSync('email_area_disease.txt','utf8');
	// var users = userFile.split(/\r?\n/);
	// var usersJSON = {};
	// var area_disease = {};

	// for (i=0; i<users.length; i++){
	// 	users[i] = users[i].split("/");
	// 	usersJSON[users[i][0]] = {};
	// 	usersJSON[users[i][0]]["area"] = users[i][1].split(",");
	// 	usersJSON[users[i][0]]["disease"] = users[i][2].split(",");

	// 	usersJSON[users[i][0]]["area"].forEach(function(a) {
 //    		usersJSON[users[i][0]]["disease"].forEach(function(d) {
 //    			if (!(a in area_disease)){
	// 				area_disease[a] = {};
	// 			}
	// 			area_disease[a][d] = "";
	// 			// if (!area_disease[a].includes(d)){
	// 			// 	area_disease[a].push(d);
	// 			// }
 //    		});
	// 	});
	// }

	// var myJSONObject = {"ircEvent": [], "method": "newURI", "regex": "^http://.*"};
	// myJSONObject.ircEvent.push("fire");
	// myJSONObject["newProp"] = "water";

	// console.log(myJSONObject);
	// console.log(myJSONObject.ircEvent);
	// console.log(usersJSON);
	// console.log(area_disease);

	var area_disease = {};


	obj["area"] = obj["area"].split(",");
	obj["disease"] = obj["disease"].split(",");

	console.log(obj);

	obj["area"].forEach(function(area) {
   		obj["disease"].forEach(function(disease) {
			if (!(area in area_disease)){
					area_disease[area] = {};
				}
			area_disease[area][disease] = "";
		});
	});

	console.log(area_disease);


	// console.log(users);

	var oneMonthAgo = new Date();
	oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
	console.log(oneMonthAgo);

	for (var area in area_disease){
		console.log(area);
		console.log(area_disease[area]);
		for (var disease in area_disease[area]){
			console.log("chut");
			console.log(area+" "+disease);
			
			googleTrends.interestOverTime({keyword: disease, startTime: oneMonthAgo, geo: area})
			.then(function(results){
				console.log(area+" "+disease);
				resultJSON = JSON.parse(results);
			  	var peakDates = getPeakDates(resultJSON.default.timelineData);
			  	if (peakDates.length == 0){
			  		area_disease[area][disease] = "no peak";
			  	}
			  	else{
			  		area_disease[area][disease] = peakDates[peakDates.length-1]["formattedTime"];
			  	}
			  	console.log(peakDates);
			  	// res.send(results);
			})
			.catch(function(err){
			  console.error('Oh no there was an error', err);
			});
			await sleep(1000);
		}
	}
	
	

	// sleep(500).then(() => {
 //  		console.log(area_disease);
	// })


	// await sleep(10000);

	console.log(area_disease);
	res.send(area_disease);
	
	// googleTrends.interestOverTime({keyword: 'measles', startTime: oneMonthAgo, geo: "US-PA"})
	// .then(function(results){
	// 	console.log("chut");
	// 	resultJSON = JSON.parse(results);
	//   	var peakDates = getPeakDates(resultJSON.default.timelineData);
	//   	console.log(peakDates);
	//   	res.send(results);
	// })
	// .catch(function(err){
	//   console.error('Oh no there was an error', err);
	// });


	// googleTrends.interestOverTime({keyword: 'Ebola', startTime: new Date('2019-01-15'), endTime: new Date('2019-02-15')})
	// .then(function(results){
	// 	console.log("chut");

	//   	res.send(results);
	// })
	// .catch(function(err){
	//   console.error('Oh no there was an error', err);
	// });
})

//Any other URL request will redirect to the main page
app.get('*',function (req, res) {
	res.redirect('./index.html');
});

//Have the server listen to port 8080
app.listen(8080,function(){
	console.log('Server Running');

});

//returns true if value is an integer
function isInt(value) {
  return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}