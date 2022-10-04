const toggleBtn = document.querySelector("#Toggle");

function changeTheme() {
  let Body = document.documentElement;
  Body.className = toggleBtn.checked ? "dark" : "light";
}

let form = document.querySelector("#form--container");
let searchDisplay = document.querySelector("#Search");
let searchbtn = document.querySelector("#search-btn");
let cityName = document.querySelector("h1");

form.addEventListener("submit", city);

function city(e) {
  e.preventDefault();
  //weather api
  cityName.innerHTML = searchDisplay.value;
  let apiKey = "c57ce4bd372d8c67eb7282dd25e41eae";
  let country =searchDisplay.value ;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${country}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(results);

  function results(response) {
    console.log(response.data.main.temp);
    temp.innerHTML = response.data.main.temp;
  }

  //for the time

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

let temp = document.querySelector(".temp");

fah.addEventListener("click", fahConvert);
cel.addEventListener("click", celConvert);

function fahConvert() {
  temp.innerHTML = 66;
}
function celConvert() {
  temp.innerHTML = 17;
}

}
