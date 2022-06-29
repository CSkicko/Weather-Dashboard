var searchBtn = document.getElementById("search-button");
var searchInput = document.getElementById("searched-city");
var currentWeather = document.getElementById("current-conditions");

var getWeatherData = function(event){
    event.preventDefault();
    var searchItem = searchInput.value;
    var apiUrl = "http://api.positionstack.com/v1/forward?access_key=55515964d41906e81966df595b39b4f2&query=" + searchItem;
    if (searchItem){
        fetch(apiUrl)
            .then(function (response) {
                if (response.status === 200){
                    return response.json();
                }
                else {
                    alert("Cannot find resource, please try again.");
                }
            })
            .then(function (data) {
                // console.log(data.data)
                if (data.data.length){
                    var latitude = data.data[0].latitude;
                    var longitude = data.data[0].longitude;
                    var coordinates = [latitude, longitude];
                    retrieveForecast(coordinates, searchItem);
                } else {
                    alert("City not found, please enter a valid city");
                }
            })
    }
}

var retrieveForecast = function(coords, city){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coords[0] + "&lon=" + coords[1] + "&exclude=minutely,hourly,alerts&units=metric&appid=f660a3811e9a5d90a12e993e669272c0"
    console.log(apiUrl);
    console.log(city);
    fetch(apiUrl)
        .then(function (response) {
            if (response.status === 200){
                return response.json();
            }
            else {
                alert("Cannot find resource, please try again.");
            }
        }) 
        .then(function(data) {
            displayCurrent(data.current, city);
            display5DayForecast(data.daily);
        })
}

var displayCurrent = function(weatherData, city){
    // Set up variables
    var currentTemp = weatherData.temp;
    var currentWind = weatherData.wind_speed;
    var currentHumidity = weatherData.humidity;
    var currentUvi = weatherData.uvi;
    var currentIcon = weatherData.weather[0].icon;
    var titleElem = document.createElement("h3");
    var tempElem = document.createElement("p");
    var windElem = document.createElement("p");
    var humidityElem = document.createElement("p");
    var uviElem = document.createElement("p");

    // Create element content
    titleElem.innerHTML = city + " (" + moment(weatherData.dt, "X").format("DD/MM/YYYY") +") <img src=http://openweathermap.org/img/wn/" + currentIcon + "@2x.png>";
    tempElem.innerHTML = "Temperature: " + currentTemp + " \u00B0C";
    windElem.innerHTML = "Wind: " + currentWind + " kph";
    humidityElem.innerHTML = "Humidity: " + currentHumidity + " %";
    uviElem.innerHTML = "UVI: <span class='uv-indicator p-1 rounded' data-uv='high'>" + currentUvi + "</span>"; 

    // Add elements to current weather div
    currentWeather.innerHTML = "";
    currentWeather.append(titleElem);
    currentWeather.append(tempElem);
    currentWeather.append(windElem);
    currentWeather.append(humidityElem);
    currentWeather.append(uviElem);

    // Set uv indicator color
    if (currentUvi < 3){
        document.getElementsByClassName("uv-indicator")[0].dataset.uv = "low";
    } else if (currentUvi < 6){
        document.getElementsByClassName("uv-indicator")[0].dataset.uv = "medium";
    }
    
}

var display5DayForecast = function(weatherData){
    var weatherForecastCards = document.getElementsByClassName("weather-card");
    for (var i = 0; i < weatherForecastCards.length; i++){
        var forecastDate = moment(weatherData[i+1].dt, "X").format("DD/MM/YYYY");
        var forecastIconURL = "http://openweathermap.org/img/wn/" + weatherData[i+1].weather[0].icon + "@2x.png"
        
        weatherForecastCards[i].innerHTML = "<h6>" + forecastDate + "</h6><img src=" + forecastIconURL + ">";
    }
    console.log(weatherData);
}

searchBtn.addEventListener("click", getWeatherData);