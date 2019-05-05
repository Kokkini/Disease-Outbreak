// var fs = require('fs');
// var http = require('http');
//Gets and displays Calculation prompts on main page
function displayCalc(){
	//Create URL to calculation page
	var URL = "http://localhost:8080/calc";	
	
	//Construct AJAX request to localhost
	$.ajax({
		type: "GET",
		url: URL,
		data: "{}",
		dataType: "html",
		success: function(msg){
			$("#content").html(msg);
		},
		error: function(xhr, ajaxOptions, thrownError){
			alert("Error contacting server!");
		}
	});
}

//Gets and displays factorial or summation result to calculation page
function getCalc(){
	//Get seed and calculation method specified by client
	var seed = $("#seed_input").get(0).value;
	var dropdown = $("#calc_opts").get(0);
	var opt = dropdown.options[dropdown.selectedIndex].value;
	//Seed will be sent to server in json
	var jsonObj = {
		"seed":seed
	};
	//Create URL based on option chosen
	var URL = "http://localhost:8080/";	
	if(opt == "fact"){
		URL += "fact";
	}
	else{
		URL += "sum";
	}
	
	//Construct AJAX request to localhost
	$.ajax({
		type: "GET",
		url: URL,
		data: jsonObj,
		dataType: "html",
		success: function(msg){
			$("#out_calc").html(msg);
		},
		error: function(xhr, ajaxOptions, thrownError){
			alert("Error contacting server!");
		}
	});
}

//Gets and displays weather prompt on main page
function displayWeather(){
	//Create URL to weather page
	var URL = "http://localhost:8080/weather";	
	
	//Construct AJAX request to localhost
	$.ajax({
		type: "GET",
		url: URL,
		data: "{}",
		dataType: "html",
		success: function(msg){
			$("#content").html(msg);
		},
		error: function(xhr, ajaxOptions, thrownError){
			alert("Error contacting server!");
		}
	});
}

//Gets and displays weather data on the weather page
function getWeather(){
	//Create URL to getWeather page
	var URL = "http://localhost:8080/getWeather";	
	// var simple = `{"area": "US-PA,US-NY", "disease": "measles,malaria"}`;
	var simple = JSON.stringify({"area": "US-PA,US-NY", "disease": "measles,malaria"});
	// var jsonData = {'area': {'US-PA':'','US-NY':''}, 'disease': {'measles':'','malaria':''}};
	//Construct AJAX request to localhost
	$.ajax({
		type: "POST",
		url: URL,
		data: simple,
		dataType: "text",
		success: function(msg){

			console.log(msg);

			msgJSON = JSON.parse(msg);
			for (var area in msgJSON){
				console.log(area);
			}

			// msg = JSON.stringify(msgJSON);


			// // $("#out_weather").html(msg);
			// console.log(msg.default.timelineData[0].value);
			// // var average = getAverage(msg.default.timelineData);
			// var peakDates = getPeakDates(msg.default.timelineData);

			// for (i=0; i<peakDates.length; i++){
			// 	console.log(peakDates[i]);
			// }

			// console.log("peak dates length:" + peakDates.length.toString());

			// var textContent = fetch('email_area_disease.txt');//.then(response => response.text()).then(text => console.log(text))

			// var textContent = readTextFile("file://email_area_disease.txt");

			

			// var textContent = fs.readFileSync('email_area_disease.txt','utf8');

			// var content;
			// // First I want to read the file
			// fs.readFile('email_area_disease.txt', function read(err, data) {
			//     if (err) {
			//         throw err;
			//     }
			//     content = data;

			//     // Invoke the next step here however you like
			//     // console.log(content);   // Put all of the code here (not the best solution)
			//     // processFile();          // Or put the next step in a function and invoke it
			// });

			// console.log(content);


			// $("#json").html(msg);
			document.getElementById("json").innerHTML = JSON.stringify(msgJSON, undefined, 2);

			// var html_str = JSON.stringify(msg);
			// $("#out_weather").html(html_str);

		},
		error: function(xhr, ajaxOptions, thrownError){
			alert("Error contacting server!");
		}
	});
}

function getAverage(timelineData){
	if(timelineData.length == 0) return 0;
	console.log(timelineData);
	var sum = 0;
	for (i = 0; i < timelineData.length; i++) {
		sum += timelineData[i].value[0];
		console.log(timelineData[i].value[0]);
	}
	return 1.0*sum/timelineData.length;
}

function getPeakDates(timelineData, peakParam=2){
	var avg = getAverage(timelineData);
	var std = getSTD(timelineData);
	console.log("avg:"+avg.toString());
	console.log("std:"+std.toString());
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

function register(){
	document.getElementById("out_weather").innerHTML = "You have registered successfully!";
}