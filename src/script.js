function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  return `${day}, ${hours}:${minutes}`;
}

function formatWeekday(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index !== 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col">
        <div class="forecast-day">${formatWeekday(forecastDay.dt)}</div>
        <img src=${changeIcon(forecastDay.weather[0].icon)}
           alt="" />
        <div class="forecast-temperature">
          <span class="forecast-temperature-max">${Math.round(
            forecastDay.temp.max
          )}°</span>
          <span class="forecast-temperature-min">${Math.round(
            forecastDay.temp.min
          )}°</span>
        </div>
      </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "60eb3beb1273b192a3e9365df3418b28";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  console.log(response.data);
  let cityElement = document.querySelector("#city");
  let temperatureElement = document.querySelector("#temperature");
  let descriptionElement = document.querySelector("#description");
  let feelsLikeElement = document.querySelector("#feels-like");
  let windElement = document.querySelector("#wind");
  let humidityElement = document.querySelector("#humidity");
  let dateElement = document.querySelector("#date-time");
  let iconElement = document.querySelector("#weather-icon");

  celsiusTemperature = response.data.main.temp;

  cityElement.innerHTML = response.data.name;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  descriptionElement.innerHTML = response.data.weather[0].description;
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);
  windElement.innerHTML = Math.round(response.data.wind.speed);
  humidityElement.innerHTML = response.data.main.humidity;
  dateElement.innerHTML = formatDate(response.data.dt);
  iconElement.setAttribute("src", changeIcon(response.data.weather[0].icon));
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "60eb3beb1273b192a3e9365df3418b28";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function changeIcon(icon) {
  let clearDay = "icons/degry.01d.png";
  let partCloudDay = "icons/degry.02d.png";
  let cloud = "icons/degry.03.png";
  let rain = "icons/degry.10.png";
  let thunderstorm = "icons/degry.11.png";
  let snow = "icons/degry.13.png";
  let clearNight = "icons/degry.01n.png";
  let partCloudNight = "icons/degry.02n.png";
  let fog = "icons/degry.50.png";

  if (icon === "01d") {
    return clearDay;
  } else if (icon === "01n") {
    return clearNight;
  } else if (icon === "02d") {
    return partCloudDay;
  } else if (icon === "02n") {
    return partCloudNight;
  } else if (
    icon === "03d" ||
    icon === "04d" ||
    icon === "03n" ||
    icon === "04n"
  ) {
    return cloud;
  } else if (
    icon === "09d" ||
    icon === "10d" ||
    icon === "09n" ||
    icon === "10n"
  ) {
    return rain;
  } else if (icon === "11d" || icon === "11n") {
    return thunderstorm;
  } else if (icon === "13d" || icon === "13n") {
    return snow;
  } else if (icon === "50d") {
    return fog;
  } else {
    return `http://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}

function wallpaper() {
  let now = new Date();
  let hours = now.getHours();

  if (hours > 17) {
    document.body.style.background =
      "linear-gradient(109.6deg, rgb(36, 45, 57) 11.2%, rgb(16, 37, 60) 51.2%, rgb(0, 0, 0) 98.6%)";
    document.body.style.color = "#e7eaf6";
  }
}
wallpaper();

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apikey = "60eb3beb1273b192a3e9365df3418b28";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`;

  axios.get(apiUrl).then(displayTemperature);
  axios.get(apiUrl).then(displayForecast);
}

function locate(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let currentButton = document.querySelector("#current-location");
currentButton.addEventListener("click", locate);

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

search("Gloucester");

displayForecast();
