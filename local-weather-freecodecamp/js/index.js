$(document).ready(function(){

units = "f";
$("#btnImperial").prop("disabled",true);
getWeather(units);


$(".btnUnits").on("click", function(){
	$(this).prop("disabled", true);
	if(this.value === "metric"){
		$("#btnImperial").prop("disabled", false);
		getWeather("c");
	}else{
		$("#btnMetric").prop("disabled", false);
		getWeather("f");
	}
});

function getWeather(units){
	$.getJSON("http://ipinfo.io/geo", function(loc){
		var Y = $(document).height(); 
		var X = $(document).width();
		$("#map").css("background", "url('https://maps.googleapis.com/maps/api/staticmap?center="+loc.city+", "+loc.region+" "+loc.country+"&zoom=10&size="+X+"x"+Y+"&style=element:labels|100&style=invert_lightness:true&key=AIzaSyA3ORj1zpVa1Nldc8SKexyKRbkCQCrrWZU') no-repeat ");
		var locationQuery = escape("select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='"+loc.city+", "+loc.region+" "+loc.country+"') and u='"+units+"'");
		var url = "https://query.yahooapis.com/v1/public/yql?q="+locationQuery+"&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
		$.getJSON(url, function(w){
			var weather = w.query.results.channel;
			//console.log(weather);
			$("#source").html(weather.title);
			$("#currentTemp").html(weather.item.condition.temp+
				"<span id='units'>&deg;"+
				weather.units.temperature+
				"</span>");
			$("#icon").addClass("wi wi-yahoo-"+weather.item.condition.code);
			$("#textCondition").html(weather.item.condition.text);
			$("#tempMin").html("min "+weather.item.forecast["0"].low+" &deg;"+weather.units.temperature + " | ");
			$("#tempMax").html(weather.item.forecast["0"].high+" &deg;"+weather.units.temperature +  " max");
			$("#wind").html(weather.wind.speed+" "+weather.units.speed);
			$("#humidity").html(weather.atmosphere.humidity+"%");
			$("#pressure").html(weather.atmosphere.pressure+" "+weather.units.pressure);
			$("#visibility").html(weather.atmosphere.visibility+" "+weather.units.distance);
			$("#sunrise").html(weather.astronomy.sunrise);
			$("#sunset").html(weather.astronomy.sunset);
			$("#lastUpdate").html(weather.item.condition.date);
		}).fail(function(Error) {
			//alert("Could not get the forecast! :/ ")
		}); 
		//console.log(loc);
	}).fail(function(Error) {
		//alert("Could not get your geolocalization! :/ ")
	});
} 
});

// AIzaSyA3ORj1zpVa1Nldc8SKexyKRbkCQCrrWZU