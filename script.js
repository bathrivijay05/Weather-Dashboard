// Layout elements
const forecastDetails = document.querySelector('#forecastDetails');
const searchContainer = document.querySelector('.search-container');
const mainTitle = document.querySelector('h1');
const weatherContainer = document.querySelector('.weather-details');
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('#search-button');
const searchBarInfo = document.querySelector('.search-container p');

const currentLocation = document.querySelector('#currentLocation');
const currentTemp = document.querySelector('#currentTemp');
const currentDesc = document.querySelector('#currentDesc');
const sun = document.querySelector('#sun');
const clouds = document.querySelector('#clouds');
const wind = document.querySelector('#wind');
const pressure = document.querySelector('#pressure');
const humidity = document.querySelector('#humidity');
const visibility = document.querySelector('#visibility');
const weatherIcon = document.querySelector('#weatherIcon');
const tempDesc = document.querySelector('#tempDesc');
const updateTime = document.querySelector('#updateTime');

// OpenWeatherMap API Key
const apiKey = '0d501c392d1a1e67d7c5de08391f719a';

// Function to fetch Current Weather data
async function fetchWeatherData(location) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Function to fetch 5-days Forecast data
async function fetchForecastData(location) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Function to handle user input and overall data fetching
async function handleSearchInput() {
    try {
        const query = document.querySelector('input').value;
        const data1 = await fetchWeatherData(query);
        const data2 = await fetchForecastData(query);
        displayWeatherDetails(data1);
        displayForecastDetails(data2);
    } catch (error) {
        console.log('Location not found:', error);
        searchBarInfo.innerHTML = 'Location not available, please enter another one!';
        searchBarInfo.style.display = 'block';
    }
}

// Display Current Weather onto webpage
function displayWeatherDetails(weatherData) {

    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    currentLocation.innerHTML = `${weatherData.name}, ${weatherData.sys.country}`;
    currentTemp.innerHTML = `${Math.round(weatherData.main.temp)}°C`;
    currentDesc.innerHTML = `<p>${weatherData.weather[0].description}</p><p>Feels like ${Math.round(weatherData.main.feels_like)}°C</p>`;
    wind.innerHTML = `${Math.round(weatherData.wind.speed * 3.6)} km/h ${degreesToDirection(weatherData.wind.deg)}`;
    pressure.innerHTML = `${Math.round(weatherData.main.pressure)} hPa`;
    visibility.innerHTML = `${Math.round(weatherData.visibility/1000.0)} km`;
    humidity.innerHTML = `${Math.round(weatherData.main.humidity)}%`;
    clouds.innerHTML = `${Math.round(weatherData.clouds.all)}%`;
    
    let timezone = weatherData.timezone;
    let sunrise = weatherData.sys.sunrise;
    let sunset = weatherData.sys.sunset;

    let sunriseStr = moment.utc(sunrise,'X').add(timezone,'seconds').format('hh:mm A');
    let sunsetStr = moment.utc(sunset,'X').add(timezone,'seconds').format('hh:mm A');

    sun.innerHTML = `<span>${sunriseStr}</span><span>${sunsetStr}</span>`;

    updateTime.innerHTML = moment.unix(weatherData.dt).format('hh:mm A');

    tempDesc.innerHTML = `The high will be ${Math.round(weatherData.main.temp_max)}°C, the low will be ${Math.round(weatherData.main.temp_min)}°C.`;

    searchContainer.style.padding = '0px 0px 0px 0px';
    searchContainer.style.height = 'auto';
    weatherContainer.style.display = 'block';
    mainTitle.style.display = 'none';
    searchBarInfo.style.display = 'none';
}

// Display 5-days weather forecast onto webpage
function displayForecastDetails(weatherData) {
    forecastDetails.innerHTML = '';

    let timezone = weatherData.city.timezone;
    
    weatherData.list.forEach(day => {

        let currTime = day.dt;
        let currTimeStr = moment.utc(currTime,'X').add(timezone,'seconds').format('ddd, h A');
        const div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = `<p>${currTimeStr}</p>
                        <img class="item-icon" src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"></img>
                        <p class="item-desc">${day.weather[0].description}</p>
                        <p>${Math.round(day.main.temp_max)}° / ${Math.round(day.main.temp_min)}°</p>
                        <p>${Math.round(day.pop * 100.0)}% Precipitation</p>`;
        forecastDetails.appendChild(div);
        
    });
}

// Find Wind direction based on angle
function degreesToDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

// Event Listener
searchButton.addEventListener('click',handleSearchInput);
searchInput.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {
        handleSearchInput();
    }
});