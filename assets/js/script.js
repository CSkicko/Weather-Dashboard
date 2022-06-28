var searchBtn = document.getElementById("search-button");
var searchInput = document.getElementById("searched-city");

var createGeocode = function(event){
    event.preventDefault();
    var searchItem = searchInput.value;
    var apiUrl = "http://api.positionstack.com/v1/forward?access_key=55515964d41906e81966df595b39b4f2&query=" + searchItem;
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data.data)
            var latitude = data.data[0].latitude;
            var longitude = data.data[0].longitude;
            console.log("Latitude: " + latitude);
            console.log("Longitude: " + longitude);
        })
}

searchBtn.addEventListener("click",createGeocode);