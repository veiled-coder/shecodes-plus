const toggleBtn = document.querySelector("#Toggle");
let form = document.querySelector("#form--container");
let searchDisplay = document.querySelector("#Search");
let searchbtn = document.querySelector("#search-btn");

let cityName = document.querySelector("h1");
let temp = document.querySelector(".temp");
let tempUnit = "metric";
let apiKey = "c57ce4bd372d8c67eb7282dd25e41eae";
let current = document.querySelector(".current-location");
let humidity = document.querySelector(".humidity");
let wind = document.querySelector(".wind");
let action = document.querySelector(".action");

function changeTheme() {
  let Body = document.documentElement;
  Body.className = toggleBtn.checked ? "dark" : "light";
}

form.addEventListener("submit", weatherInfo);

function weatherInfo(e) {
  e.preventDefault();
  let searchValue = searchDisplay.value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&units=${tempUnit}&appid=${apiKey}`;
  axios.get(apiUrl).then(results);
  function results(response) {
    console.log(response.data.weather[0].main);
    temp.innerHTML = response.data.main.temp;
    cityName.innerHTML = searchValue;
    humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
    wind.innerHTML = `Wind: ${response.data.wind.speed}km/hr`;
    action.innerHTML = `${response.data.weather[0].main}`;
  }
}

//current-location

current.addEventListener("click", getCurrent);
function getCurrent() {
  navigator.geolocation.getCurrentPosition(myResponse);
}
function myResponse(location) {
  let apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=${tempUnit}&appid=${apiKey}`;
  axios.get(apiUrlCurrent).then(currentResult);
  function currentResult(response) {
    console.log(response.data.main.temp);
    cityName.innerHTML = `${response.data.name}`;
    temp.innerHTML = ` ${response.data.main.temp}`;
    humidity.innerHTML = `humidity: ${response.data.main.humidity}%`;
    wind.innerHTML = `Wind: ${response.data.wind.speed}km/hr`;
    action.innerHTML = `${response.data.weather[0].main}`;
  }
}
//time

let day = new Date();
let weekday = day.getDay();

let hour = day.getHours();

let min = day.getMinutes();
let dateText = document.querySelector("#date-text");
console.log(weekday);

let week = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

dateText.innerHTML = `${week[weekday]} 
${hour < 10 ? "0" + hour : hour}:${min < 10 ? "0" + min : min}`;

let fah = document.querySelector(".fah");
let cel = document.querySelector(".cel");

// fah.addEventListener("click", fahConvert);
// cel.addEventListener("click", celConvert);

// function fahConvert() {
//   tempUnit='imperial';
// }
// function celConvert() {
//   tempUnit = 'metric';
// }
