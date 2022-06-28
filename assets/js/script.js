var searchBtn = document.getElementById("search-button");
var searchInput = document.getElementById("searched-city");

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
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coords[0] + "&lon=" + coords[1] + "&exclude=minutely,hourly,alerts&appid=f660a3811e9a5d90a12e993e669272c0"
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
            console.log(data);
        })
}

searchBtn.addEventListener("click", getWeatherData);