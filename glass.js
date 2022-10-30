const toggleBtn = document.querySelector("#Toggle");
let form = document.querySelector("#form--container");
let searchDisplay = document.querySelector("#Search");
let forecastDay = document.querySelector(".forecast--day");
let cityName = document.querySelector("h1");
let temp = document.querySelector(".temp");
let tempUnit = "metric";
let apiKey = "8cac06f7ab6c10287cd06a316ff84a57";

let h3 = document.querySelector("h3");
let current = document.querySelector(".current-location");
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

//changing theme
function changeTheme() {
  let Body = document.documentElement;
  Body.className = toggleBtn.checked ? "dark" : "light";
}
toggleBtn.addEventListener("click", changeTheme);

// weather

const openWeather = axios.create({
  baseURL: `https://api.openweathermap.org/`,
});
form.addEventListener("submit", weatherInfo);

function weatherInfo(e) {
  e.preventDefault();
  let searchValue = searchDisplay.value;

  openWeather
    .get(`data/2.5/weather?q=${searchValue}&units=${tempUnit}&appid=${apiKey}`)
    .then(results);
  function results(weatherResponse) {
    console.log(weatherResponse.data.weather[0].main);

    weatherDetails(weatherResponse);
  }
}
//RESPONSE RECEIVED FROM THE WEATHER INFO CALL
function weatherDetails(response) {
  console.log(response.data.coord);
  let lat = response.data.coord.lat;
  let long = response.data.coord.lon;

  //API CALL FOR FORECAST
  async function getforeCast() {
    const forecastInfo = await openWeather.get(
      `/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`
    );
    console.log(forecastInfo.data);
    //content display
    function forecastDisplay() {
      days.style.display = "grid";
      h3.style.visibility = "visible";
      instruct.style.display = "none";
    }

    forecastDisplay();
    //GET DAYNAME FROM DAILY FORCAST API

    function formatDay(timestamp) {
      let day = new Date(timestamp * 1000);
      let getday = day.getDay();

      let week = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

      return week[getday];

      // formatDay was called in the html with the number value of the dt as our timestamp
    }
    // FORECAST DISPLAY
    let dailyForecast = forecastInfo.data.daily;
    console.log(dailyForecast);
    function forecast() {
      let daysHtml = "";

      dailyForecast.forEach((day, index) => {
        // console.log(day.weather[0].description);
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
        for (i = 0; i < mintmp.length; i++) {
          mintmp[i].innerHTML = Math.round(
            (dailyForecast[i].temp.min * 9) / 5 + 32
          );
          maxtmp[i].innerHTML = Math.round(
            (dailyForecast[i].temp.max * 9) / 5 + 32
          );

          fah.classList.add("active");
          cel.classList.remove("active");
        }
      }
      // convert to celcius
      cel.addEventListener("click", celConvert);

      function celConvert() {
        for (i = 0; i < mintmp.length; i++) {
          let minprevious = Math.round(dailyForecast[i].temp.min);
          let maxprevious = Math.round(dailyForecast[i].temp.max);
          mintmp[i].innerHTML = minprevious;
          maxtmp[i].innerHTML = maxprevious;
        }

        temp.innerHTML = celciustemp;

        cel.classList.add("active");
        fah.classList.remove("active");
      }
    }
    forecast();

    // TIMEZONES OF DIFFRENT REGIONS
    let timezone = forecastInfo.data.timezone;

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

    // TPM CONVERSION
  }
  getforeCast();
  //USING INFO FROM WEATHERINFO API CALL
  celciustemp = Math.round(response.data.main.temp);
  temp.innerHTML = celciustemp;
  const countryName = response.data.sys.country;
  cityName.innerHTML = `${response.data.name}, ${countryName}`;

  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  wind.innerHTML = `Wind: ${response.data.wind.speed}km/hr`;
  let description = `${response.data.weather[0].description}`;
  action.innerHTML = description;

  iconWeather.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconWeather.setAttribute("alt", `${response.data.weather[0].description}`);
  iconWeather.style.display = "block";

  cel.classList.add("active");
  fah.classList.remove("active");

  // time based on location timeZone
}

//current-location

current.addEventListener("click", getCurrent);
function getCurrent() {
  navigator.geolocation.getCurrentPosition(myResponse);
}
function myResponse(location) {
  let apiUrlCurrent = `/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=${tempUnit}&appid=${apiKey}`;
  openWeather.get(apiUrlCurrent).then(currentResult);
  function currentResult(weatherResponse) {
    console.log(weatherResponse.data.main.temp);
    weatherDetails(weatherResponse);
  }
}
//time

// let day = new Date();
// let weekday = day.getDay();

// let hour = day.getHours();

// let min = day.getMinutes();
// let dateText = document.querySelector("#date-text");
// console.log(weekday);

// getting current time of our search result;
