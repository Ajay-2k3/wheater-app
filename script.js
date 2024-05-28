const search=document.querySelector(".search");
const current_weather=document.querySelector(".current-weather");
const weatherCardDiv = document.querySelectorAll(".weather")
const weatherlist=document.querySelector(".weatherlist");
const clearbtn=document.querySelector(".clearbtn");
const searchinput=document.querySelector(".searchinput");
const cityInput =document.querySelector(".city-input"); 
const wImage = document.querySelectorAll(".w-logo img");
const Cname = document.querySelectorAll(".cityname");
const temperture = document.querySelectorAll(".celus")
const wDate = document.querySelectorAll(".date");
const windSpeed = document.querySelectorAll(".wind")
const weatherHumidity = document.querySelectorAll(".humidity")
const locationButton = document.querySelector(".location")

const API_key = "&limit=1&appid=c83c4e56cc901181782f471b4959e137";

const createWeatherCard = (cityName, weatherItem, index) => {
        const options = {
            weekday: "long", day: "numeric",month: "long"
    };
  
        Cname[index].innerHTML = cityName;
        TValue = (weatherItem.main.temp - 273.15);
        temperture[index].innerHTML = parseInt(TValue) + "<p>&deg;C</p>" ;
        var dfchange = new Date(weatherItem.dt_txt.split(" ")[0]) 
        wDate[index].innerHTML = dfchange.toLocaleDateString("en-ZA",options);
        windSpeed[index].innerHTML = weatherItem.wind.speed + "M/S";
        weatherHumidity[index].innerHTML = weatherItem.main.humidity + "%";
        weatherImage(weatherItem.weather[0].main, index);
}

const weatherImage = (WImage, index) =>{
    switch(WImage){
        case "Clear":
            wImage[index].src = "./animated/day.svg";
            break;
        case "Rain":
            wImage[index].src = "./animated/rainy-7.svg";
            break;
        case "Clouds":
            wImage[index].src = "./animated/cloudy-day-2.svg";
            break;
        case "Snow":
            wImage[index].src = "./animated/snowy-6.svg";
            break;
        case "Mist":
            wImage[index].src = "./animated/forecast-cloud-fog-foggy-weather-svgrepo-com.svg"
            break;
        }
}
 const  getWeatherDetails = (cityName, latitude, longitude

  ) => {
    const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ latitude +'&lon=' + longitude + '&appid=c83c4e56cc901181782f471b4959e137';
    
    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
 
        //filter the forcast date to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
        cityInput.value = "";

        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach((weatherItem, index) => {
            cityInput.value = cityName;
            createWeatherCard(cityName, weatherItem, index);
        })
    }).catch(() => {
        alert(" An error occured while fetching the weather forecast !!");
     });

 }

//weatherlist.classList.add('active-list');
//current_weather.classList.add('active-cw');
//searchinput.classList.add('active-SI');

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName === "") return;
   
   const urlapi = 'https://api.openweathermap.org/geo/1.0/direct?q=';
    const GEOCODING_API_URL = urlapi+cityName+API_key;

    fetch(GEOCODING_API_URL).then(response => response.json()).then(data => {
        if(!data.length){
            weatherlist.classList.remove('active-list');
            current_weather.classList.remove('active-cw');
            searchinput.classList.remove('active-SI');
            return alert("Invalid input! enter correctly !");
        } 
        const { name, lat, lon } = data[0]; 
        getWeatherDetails(name, lat, lon );
        weatherlist.classList.add('active-list');
        current_weather.classList.add('active-cw');
        searchinput.classList.add('active-SI');

     }).catch(() => {
        alert(" An error occured while fetching the coordinates!");
     });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            console.log(position);
            const { latitude, longitude } = position.coords; // Get coordinates of user location
            // Get city name from coordinates using reverse geocoding API
            const API_URL = 'https://api.openweathermap.org/geo/1.0/reverse?lat='+ latitude +'&lon=' + longitude + '&limit=1&appid=c83c4e56cc901181782f471b4959e137';
            fetch(API_URL).then(response => response.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
                weatherlist.classList.add('active-list');
                current_weather.classList.add('active-cw');
                searchinput.classList.add('active-SI');
            }).catch(() => {
                alert("An error occurred while fetching the city name!");
                
            });
        },
        error => { // Show alert if user denied the location permission
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        });
}

/*search.addEventListener('click', ()=>{
    if(cityInput.value !== ""){
        weatherlist.classList.add('active-list');
        current_weather.classList.add('active-cw');
        searchinput.classList.add('active-SI');

    }else{
        weatherlist.classList.remove('active-list');
        current_weather.classList.remove('active-cw');
        searchinput.classList.remove('active-SI');
    }
});*/
locationButton.addEventListener('click', ()=>{
    if(cityInput.value !== ""){
        weatherlist.classList.add('active-list');
        current_weather.classList.add('active-cw');
        searchinput.classList.add('active-SI');

    }else{
        weatherlist.classList.remove('active-list');
        current_weather.classList.remove('active-cw');
        searchinput.classList.remove('active-SI');
    }
});

clearbtn.addEventListener('click',()=>{
    weatherlist.classList.remove('active-list');
    current_weather.classList.remove('active-cw');
    searchinput.classList.remove('active-SI');
})

locationButton.addEventListener("click", getUserCoordinates);
search.addEventListener("click",getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());