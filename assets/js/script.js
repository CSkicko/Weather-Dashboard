var searchCol = document.getElementById("search-column");
var searchInput = document.getElementById("searched-city");
var currentWeather = document.getElementById("current-conditions");
var instructionElems = document.getElementsByClassName("instruction");

var getWeatherData = function(event){
    event.preventDefault();
    if (event.target.tagName == "BUTTON"){
        var searchItem;
        // Check if the user is loading a previous search from the buttons
        if (event.target.type == "submit"){
            searchItem = searchInput.value;
        } else {
            searchItem = event.target.innerHTML;
        }
        // Set the url to retrieve the geocode
        var apiUrl = "http://api.positionstack.com/v1/forward?access_key=55515964d41906e81966df595b39b4f2&query=" + searchItem;
        // Ensure a search item is selected (i.e. handles someone clicking search with no input text)
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
                    if (data.data.length){
                        var latitude = data.data[0].latitude;
                        var longitude = data.data[0].longitude;
                        var coordinates = [latitude, longitude];
                        retrieveForecast(coordinates, searchItem);
                        saveSearchedCity(searchItem);
                    } else {
                        alert("City not found, please enter a valid city");
                    }
                })
        }
    }
}

var retrieveForecast = function(coords, city){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coords[0] + "&lon=" + coords[1] + "&exclude=minutely,hourly,alerts&units=metric&appid=f660a3811e9a5d90a12e993e669272c0"
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
            for (var i = 0; i < instructionElems.length; i++){
                instructionElems[i].style.display = "none";
            }
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

    // Clear current weather and add elements to current weather div
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
        
        weatherForecastCards[i].innerHTML = "<h6>" + forecastDate + "</h6><img src=" + forecastIconURL + "><p>Temp: " + weatherData[i+1].temp.day + " \u00B0C</p><p>Wind: " + weatherData[i+1].wind_speed + " kph</p><p>Humidity: " + weatherData[i+1].humidity + " %</p>";
    }
}

var saveSearchedCity = function(city){
    var newSearchesList = [];
    if (!localStorage.getItem("previousSearches")){
        newSearchesList.push(city);
    } else {
        newSearchesList = JSON.parse(localStorage.getItem("previousSearches"));
        if (!newSearchesList.includes(city) || newSearchesList == "null"){
            newSearchesList.push(city);
        }
    }
    localStorage.setItem("previousSearches", JSON.stringify(newSearchesList));
}

// var renderSavedSearches = function(){
//     localStorage
// }

searchCol.addEventListener("click", getWeatherData);