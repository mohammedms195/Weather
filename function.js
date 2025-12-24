
const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const weatherInfoSection = document.querySelector('.weather-info');
const searchCitySection = document.querySelector('.search-city');
const notFoundSection = document.querySelector('.not-found');

// Weather text fields
const countryTxt = document.querySelector('.country-txt');
const currentDateTxt = document.querySelector('.current-data-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelectorAll('.Humidity-value-txt')[0];
const windValueTxt = document.querySelectorAll('.Humidity-value-txt')[1];
const weatherIcon = document.querySelector('.weather-summary-img');

const forecastItems = document.querySelectorAll(".forecast-item");

const apiKey = "109d667d646c8de91fde8860c506a00e";


// BUTTON EVENT
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== "") {
        updateWeatherInfo(cityInput.value.trim());
        cityInput.value = "";
    }
});

// ENTER KEY EVENT
cityInput.addEventListener('keydown', (event) => {
    if (event.key === "Enter" && cityInput.value.trim() !== "") {
        updateWeatherInfo(cityInput.value.trim());
        cityInput.value = "";
    }
});


// FETCH API
async function getFetchData(endpoint, city) {
    const apiUrl =
        `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&units=metric&appid=${apiKey}`;

    const response = await fetch(apiUrl);
    return response.json();
}


// UPDATE WEATHER
async function updateWeatherInfo(city) {
    const data = await getFetchData("weather", city);

    if (data.cod != 200) {
        showSection(notFoundSection);
        return;
    }

    const {
        name,
        dt,
        weather: [{ main, icon }],
        main: { temp, humidity },
        wind: { speed }
    } = data;

    countryTxt.textContent = name;
    currentDateTxt.textContent = new Date(dt * 1000).toDateString().slice(0, 10);
    tempTxt.textContent = `${Math.round(temp)} °C`;
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = `${humidity}%`;
    windValueTxt.textContent = `${speed} M/s`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    await updateForecast(city);

    showSection(weatherInfoSection);
}


// ---------------- FORECAST CODE ----------------

async function updateForecast(city) {
    const forecastData = await getFetchData("forecast", city);

    const dailyData = {};

    // Filter 1 reading per day (12:00 PM)
    forecastData.list.forEach(entry => {
        const date = entry.dt_txt.split(" ")[0];
        const time = entry.dt_txt.split(" ")[1];

        if (time === "12:00:00") {
            dailyData[date] = entry;
        }
    });

    const forecastArray = Object.values(dailyData).slice(0, 4);

    forecastArray.forEach((day, i) => {
        const date = new Date(day.dt * 1000);
        const temp = Math.round(day.main.temp);
        const icon = day.weather[0].icon;

        forecastItems[i].querySelector(".forecast-item-date").textContent =
            date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });

        forecastItems[i].querySelector(".forcast-item-img").src =
            `https://openweathermap.org/img/wn/${icon}@2x.png`;

        forecastItems[i].querySelector(".forecast-item-temp").textContent =
            `${temp} °C`;
    });
}


// SECTION DISPLAY
function showSection(section) {
    weatherInfoSection.style.display = "none";
    searchCitySection.style.display = "none";
    notFoundSection.style.display = "none";

    section.style.display = "flex";
}
