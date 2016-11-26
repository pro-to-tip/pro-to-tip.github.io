/**
 * Title: Local Weather App (for FreeCodeCamp)
 * Author: Eina O.
 * URL: http://eina.ca
 * Description: A local weather web-app that generates your local weather based on your IP. 
 */
$(document).ready(function() {

  //http://smallenvelop.com/display-loading-icon-page-loads-completely/
  $(window).load(function() {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");
  });

  //get location by ip sadasda
  $.ajax({
    type: 'GET',
    url: 'https://ipinfo.io/json/',
    success: coordinates
  });
  //coordinates callback

  function coordinates(point) {
    var coords = point.loc.split(',');
    var lat = parseFloat(coords[0]);
    var lon = parseFloat(coords[1]);
    var city = point.city;
    var region = point.region;
    var country = point.country;

    //forecast.io api
    var api = 'https://api.forecast.io/forecast/7c693e97458b09a53aa5f7e2cd0af4a0/' + lat + ',' + lon + '?units=si';

    //display city, region and country
    displayLocation(city, region, country);

    //insert location into getWeather function
    getWeather(api);

  } //end coordinates

  function displayLocation(city, region, country) {

    //country code to full country
    $.ajax({
      type: 'GET',
      url: 'https://restcountries.eu/rest/v1/alpha?codes=' + country,
      success: function(data) {
        //spit this out to website
        $('.forecast_city').text(city + ', ' + region);
        $('.forecast_country').text(data[0].name);
      }
    });
  } //end displayLocation

  //get the damn weather
  function getWeather(url) {
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'jsonp',
      success: weather
    });

    function weather(data) {

      //main forecast
      var temp = Math.round(data.currently.temperature),
        conditions = data.currently.icon.split('-').join(' '),
        icon = data.currently.icon,
        low = Math.round(data.daily.data[0].temperatureMin),
        high = Math.round(data.daily.data[0].temperatureMax);

      //weekly forecast
      for (var i = 1; i < 6; i++) {
        var day = moment.unix(data.daily.data[i].time).format('dddd'),
          weekIcon = data.daily.data[i].icon,
          weekCond = data.daily.data[i].icon.split('-').join(' '),
          weekLow = Math.round(data.daily.data[i].temperatureMin),
          weekHigh = Math.round(data.daily.data[i].temperatureMax);
        //console.log(day, weekIcon, weekCond, weekLow, weekHigh);

        //display weekly weather
        displayWeekly(day, weekIcon, weekCond, weekLow.toFixed(0), weekHigh.toFixed(0));
      }

      //display weather on website
      displayWeather(icon, temp.toFixed(0), conditions, low, high);

      //convert daily units
      $('#unit_fah').on('click', function() {
        displayWeather(icon, toFah(temp.toFixed(0)), conditions, toFah(low), toFah(high));
        $('#unit_fah').prop('disabled', true);
        $('#unit_cel').prop('disabled', false);

        $('#weekly_list').empty();
        for (var i = 1; i < 6; i++) {
          var day = moment.unix(data.daily.data[i].time).format('dddd'),
            weekIcon = data.daily.data[i].icon,
            weekCond = data.daily.data[i].icon.split('-').join(' '),
            weekLow = toFah(Math.round(data.daily.data[i].temperatureMin)),
            weekHigh = toFah(Math.round(data.daily.data[i].temperatureMax));

          //display weekly weather
          displayWeekly(day, weekIcon, weekCond, weekLow.toFixed(0), weekHigh.toFixed(0));
        }
      });

      $('#unit_cel').on('click', function() {

        displayWeather(icon, temp.toFixed(0), conditions, low, high);
        $('#unit_cel').prop('disabled', true);
        $('#unit_fah').prop('disabled', false);

        $('#weekly_list').empty();
        for (var i = 1; i < 6; i++) {
          var day = moment.unix(data.daily.data[i].time).format('dddd'),
            weekIcon = data.daily.data[i].icon,
            weekCond = data.daily.data[i].icon.split('-').join(' '),
            weekLow = Math.round(data.daily.data[i].temperatureMin),
            weekHigh = Math.round(data.daily.data[i].temperatureMax);

          //display weekly weather
          displayWeekly(day, weekIcon, weekCond, weekLow.toFixed(0), weekHigh.toFixed(0));
        }
      });

    } //end weather callback

    function displayWeather(icon, temp, condition, low, high) {
      //plop to website

      /*$('.forecast_icon').addClass('wi wi-owm-'+ icon);*/
      $('.forecast_icon').addClass('wi wi-forecast-io-' + icon);
      $('.forecast_summary').text(condition);
      $('.high_temp').text(high + '\xB0');
      $('.low_temp').text(low + '\xB0');
      $('.forecast_temp').text(temp + '\xB0');

    } //end displayWeather

    function displayWeekly(day, icon, condition, low, high) {

      //var list = '';

      var list = '<span class="day_name">' + day + '</span>';
      list += '<span class="day_icon wi wi-forecast-io-' + icon + '"></span>';
      list += '<span class="day_cond">' + condition + '</span>';
      list += '<span class="wi wi-direction-up"></span>';
      list += '<span class="day_high">' + high + '</span>';
      list += '<span class="wi wi-direction-down"></span>';
      list += '<span class="day_low">' + low + '</span>';

      $('#weekly_list').append('<li class="day">' + list + '</li>');

    } // end display weekly weather

    function toFah(temp) {
      return parseInt(temp * (9 / 5) + 32);
    } //end convert to fahrenheit

  } //end getWeather

});