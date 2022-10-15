const toggleBtn = document.querySelector("#Toggle");
let form = document.querySelector("#form--container");
let searchDisplay = document.querySelector("#Search");

let cityName = document.querySelector("h1");
let temp = document.querySelector(".temp");
let tempUnit = "metric";
let apiKey = "c57ce4bd372d8c67eb7282dd25e41eae";
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

let a = new Date().toLocaleDateString("en-US", { timeZone: "America/chicago" });
console.log(a);
console.log(new Date(a).getHours);

//changing theme
function changeTheme() {
  let Body = document.documentElement;
  Body.className = toggleBtn.checked ? "dark" : "light";
  if (toggleBtn.checked) {
    console.log("true");

    document.body.style.backgroundImage = "url('./images/darkcloud.jpg')";
  } else {
    document.body.style.backgroundImage = "url('./images/lightcloud.jpg')";
  }
}
toggleBtn.addEventListener("click", changeTheme);

//content display
function contentDisplay() {
  days.style.display = "flex";
  h3.style.visibility = "visible";
  instruct.style.display = "none";
}

// weather
form.addEventListener("submit", weatherInfo);

function weatherInfo(e) {
  e.preventDefault();
  let searchValue = searchDisplay.value;
  if (searchValue) {
    contentDisplay();
  }
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&units=${tempUnit}&appid=${apiKey}`;

  axios.get(apiUrl).then(results);
  function results(weatherResponse) {
    console.log(weatherResponse.data.weather[0].main);

    weatherDetails(weatherResponse);
  }
}
function weatherDetails(response) {
  console.log(response.data.weather[0].icon);
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
}
//current-location

current.addEventListener("click", getCurrent);
function getCurrent() {
  navigator.geolocation.getCurrentPosition(myResponse);
  contentDisplay();
}
function myResponse(location) {
  let apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=${tempUnit}&appid=${apiKey}`;
  axios.get(apiUrlCurrent).then(currentResult);
  function currentResult(weatherResponse) {
    console.log(weatherResponse.data.main.temp);
    weatherDetails(weatherResponse);
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
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

dateText.innerHTML = `${week[weekday]} 
${hour < 10 ? "0" + hour : hour}:${min < 10 ? "0" + min : min}`;

fah.addEventListener("click", fahConvert);
cel.addEventListener("click", celConvert);

function fahConvert() {
  let fahrenheit = (celciustemp * 9) / 5 + 32;
  temp.innerHTML = Math.round(fahrenheit);
  fah.classList.add("active");
  cel.classList.remove("active");

  console.log(temp);
}
function celConvert() {
  temp.innerHTML = celciustemp;

  cel.classList.add("active");
  fah.classList.remove("active");
}
