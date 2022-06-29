var searchCol = document.getElementById("search-column");
var searchInput = document.getElementById("searched-city");
var currentWeather = document.getElementById("current-conditions");
var instructionElems = document.getElementsByClassName("instruction");
var previousSearchesElem = document.getElementById("previous-searches");

// Overarching function to get the weather data from the API
var getWeatherData = function(event){
    event.preventDefault();
    // Check to see if a button is pressed
    if (event.target.tagName == "BUTTON"){
        var searchItem;
        // Check if the user is loading a previous search from the buttons
        if (event.target.type == "submit"){
            searchItem = searchInput.value;
        } else {
            searchItem = event.target.innerHTML;
        }
        // Set the url to retrieve the geocode from positionstack API
        var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchItem + "&appid=f660a3811e9a5d90a12e993e669272c0";
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
                    // Set the latitude and longitude and pass it to retrieveForecast to get the weather data from open weather API
                    if (data.length){
                        var latitude = data[0].lat;
                        var longitude = data[0].lon;
                        var coordinates = [latitude, longitude];
                        retrieveForecast(coordinates, searchItem);
                        // Save the searched item
                        saveSearchedCity(searchItem);
                    } else {
                        alert("City not found, please enter a valid city");
                    }
                })
        }
    }
}

// Function to retrieve forecast data based on coordinates. Note city is also passed to ensure it can be provided to the displayCurrent function
var retrieveForecast = function(coords, city){
    // Generates the open weather API url based on the coordinates
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
            // Passes the data from the API into the displayCurrent and 5-day forecast functions
            displayCurrent(data.current, city);
            display5DayForecast(data.daily);
        })
}

// Function to display the current weather of the selected city
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
    titleElem.innerHTML = city + " (" + moment(weatherData.dt, "X").format("DD/MM/YYYY") +") <img src=https://openweathermap.org/img/wn/" + currentIcon + "@2x.png>";
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

// Function to display the 5-day forecast for the selected city
var display5DayForecast = function(weatherData){
    var weatherForecastCards = document.getElementsByClassName("weather-card");
    // Loop through the weather cards and add weather content to each
    for (var i = 0; i < weatherForecastCards.length; i++){
        var forecastDate = moment(weatherData[i+1].dt, "X").format("DD/MM/YYYY");
        var forecastIconURL = "https://openweathermap.org/img/wn/" + weatherData[i+1].weather[0].icon + "@2x.png"
        
        weatherForecastCards[i].innerHTML = "<h6>" + forecastDate + "</h6><img src=" + forecastIconURL + "><p>Temp: " + weatherData[i+1].temp.day + " \u00B0C</p><p>Wind: " + weatherData[i+1].wind_speed + " kph</p><p>Humidity: " + weatherData[i+1].humidity + " %</p>";
    }
}

// Function to save the searched city
var saveSearchedCity = function(city){
    var newSearchesList = [];
    // If there's nothing in local storeage then add the city to the new searches list, otherwise add the local storage items, then push the new city
    if (!localStorage.getItem("previousSearches")){
        newSearchesList.push(city);
    } else {
        newSearchesList = JSON.parse(localStorage.getItem("previousSearches"));
        // Checks to see if the city is already stored
        if (!newSearchesList.includes(city) || newSearchesList == "null"){
            newSearchesList.push(city);
        }
    }
    localStorage.setItem("previousSearches", JSON.stringify(newSearchesList));
    renderSavedSearches();
}

// Function to display the previous searches on the page
var renderSavedSearches = function(){
    previousSearchesElem.innerHTML = "";
    if (localStorage.getItem("previousSearches")){
        var searchHistory = JSON.parse(localStorage.getItem("previousSearches"));
        for (var i = 0; i < searchHistory.length; i++){
            var newElem = document.createElement("button");
            newElem.innerHTML = searchHistory[i];
            newElem.classList.add("btn", "btn-secondary", "w-100", "mb-2");
            newElem.setAttribute("type", "button");
            previousSearchesElem.append(newElem);
        }
    }
}

renderSavedSearches();
searchCol.addEventListener("click", getWeatherData);