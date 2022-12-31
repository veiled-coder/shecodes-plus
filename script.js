let toggleBtn = document.querySelector("#toggle-id");
let form = document.querySelector("#form--container");
let searchDisplay = document.querySelector("#Search");
let cityName = document.querySelector("h1");
let temp = document.querySelector(".temp");
let tempUnit = "metric";
let apiKey = "8cac06f7ab6c10287cd06a316ff84a57";
let h3 = document.querySelector("h3");
let current = document.querySelector(".search-current-location_icon");
let humidity = document.querySelector(".humidity");
let wind = document.querySelector(".wind");
let action = document.querySelector(".action");
let days = document.querySelector(".days");
let instruct = document.querySelector(".instruction");
let iconWeather = document.querySelector(".action-icon");
let celciustemp = null;
let fah = document.querySelector(".fah");
let cel = document.querySelector(".cel");
let dayName = document.querySelector(".dayName");
let dateText = document.querySelector("#date-text");
import axios from "axios";
//changing theme
function changeTheme() {
  let Body = document.documentElement;
  Body.className = toggleBtn.checked ? "light" : "dark";
}
toggleBtn.addEventListener("click", changeTheme);

// weather

const createDefaultApiCall = axios.create({
  baseURL: `https://api.openweathermap.org/`,
});
form.addEventListener("submit", weatherApiCall);

function weatherApiCall(e) {
  e.preventDefault();
  let searchValue = searchDisplay.value;

  createDefaultApiCall
    .get(`data/2.5/weather?q=${searchValue}&units=${tempUnit}&appid=${apiKey}`)
    .then(apiCallresult);
  function apiCallresult(weatherResponse) {
    console.log(weatherResponse.data.weather[0].main);
    weatherApiData(weatherResponse);
  }
}
//RESPONSE RECEIVED FROM THE WEATHER API CALL
function weatherApiData(weatherApiData) {
  console.log(weatherApiData.data.coord);
  let lat = weatherApiData.data.coord.lat;
  let long = weatherApiData.data.coord.lon;

  //API CALL FOR FORECAST
  async function callWeatherForecastApi() {
    const weatherForecastData = await createDefaultApiCall.get(
      `/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`
    );
    console.log(weatherForecastData.data);
    //content display
    function weatherForecastDisplay() {
      days.style.display = "grid";
      h3.style.visibility = "visible";
      instruct.style.display = "none";
    }

    weatherForecastDisplay();
    //GET DAYNAME FROM DAILY FORCAST API

    function formatDay(timestamp) {
      let day = new Date(timestamp * 1000);
      let getday = day.getDay();

      let week = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

      return week[getday];

      // formatDay was called in the html with the number value of the dt as our timestamp
    }
    // FORECAST DISPLAY
    let sixDaysWeatherForecast = weatherForecastData.data.daily;
    console.log(sixDaysWeatherForecast);
    function weatherForecastContent() {
      let daysHtml = "";

      sixDaysWeatherForecast.forEach((day, index) => {
        if (index > 0 && index < 7) {
          daysHtml =
            daysHtml +
            ` <div class="day day1">
                <p class="forecast--day">${formatDay(day.dt)}</p>
                       <p class="day--description">${
                         day.weather[0].description
                       }<p/>
                 <img  src='http://openweathermap.org/img/wn/${
                   day.weather[0].icon
                 }@2x.png'/>
          
                <div class="day-temp">
                <div class='min-content'>
               <span>min</span>     <p class="min cel-temp">${Math.round(
                 day.temp.min
               )} </p><span>&deg;</span>
                    </div>
                    <div class='max-content'>
                <span>max</span>    <p class="max cel-temp">${Math.round(
                  day.temp.max
                )} </p><span>&deg;</span>
                    </div>
                </div>
                
  </div>`;
        }
      });

      days.innerHTML = daysHtml;

      //  convert to fahrenheit
      fah.addEventListener("click", fahConvert);

      let mintmp = document.querySelectorAll(".min");
      let maxtmp = document.querySelectorAll(".max");
      function fahConvert() {
        temp.innerHTML = Math.round((celciustemp * 9) / 5 + 32);
        for (let i = 0; i < mintmp.length; i++) {
          mintmp[i].innerHTML = Math.round(
            (sixDaysWeatherForecast[i].temp.min * 9) / 5 + 32
          );
          maxtmp[i].innerHTML = Math.round(
            (sixDaysWeatherForecast[i].temp.max * 9) / 5 + 32
          );

          fah.classList.add("active");
          cel.classList.remove("active");
        }
      }
      // convert to celcius
      cel.addEventListener("click", celConvert);

      function celConvert() {
        for (let i = 0; i < mintmp.length; i++) {
          let minprevious = Math.round(sixDaysWeatherForecast[i].temp.min);
          let maxprevious = Math.round(sixDaysWeatherForecast[i].temp.max);
          mintmp[i].innerHTML = minprevious;
          maxtmp[i].innerHTML = maxprevious;
        }

        temp.innerHTML = celciustemp;

        cel.classList.add("active");
        fah.classList.remove("active");
      }
    }
    weatherForecastContent();

    // TIMEZONES OF DIFFRENT REGIONS
    let timezone = weatherForecastData.data.timezone;

    let timeInfo = new Date().toLocaleString("US", {
      timeZone: timezone,
      hour12: true,
      timeZoneName: "short",
    });

    let dayname = new Date().toLocaleString("US", {
      timeZone: timezone,
      weekday: "short",
    });

    dateText.innerHTML = timeInfo;

    dayName.innerHTML = dayname;
  }
  callWeatherForecastApi();
  //USING INFO FROM WEATHER API CALL
  celciustemp = Math.round(weatherApiData.data.main.temp);
  temp.innerHTML = celciustemp;
  const countryName = weatherApiData.data.sys.country;
  cityName.innerHTML = `${weatherApiData.data.name}, ${countryName}`;

  humidity.innerHTML = `Humidity: ${weatherApiData.data.main.humidity}%`;
  wind.innerHTML = `Wind: ${weatherApiData.data.wind.speed}km/hr`;
  let description = `${weatherApiData.data.weather[0].description}`;
  action.innerHTML = description;

  iconWeather.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${weatherApiData.data.weather[0].icon}@2x.png`
  );
  iconWeather.setAttribute(
    "alt",
    `${weatherApiData.data.weather[0].description}`
  );
  iconWeather.style.display = "block";

  cel.classList.add("active");
  fah.classList.remove("active");

  // time based on location timeZone
}

//current-location

current.addEventListener("click", getCurrentLocationCoordinates);
function getCurrentLocationCoordinates() {
  navigator.geolocation.getCurrentPosition(callCurrentLocationApi);
}
function callCurrentLocationApi(currentLocationCoordinates) {
  let apiUrlCurrent = `/data/2.5/weather?lat=${currentLocationCoordinates.coords.latitude}&lon=${currentLocationCoordinates.coords.longitude}&units=${tempUnit}&appid=${apiKey}`;
  createDefaultApiCall.get(apiUrlCurrent).then(useCurrentLocationApiData);
  function useCurrentLocationApiData(currentLocationApiData) {
    console.log(currentLocationApiData.data.main.temp);
    weatherApiData(currentLocationApiData);
  }
}
