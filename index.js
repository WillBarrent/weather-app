let apiKey = '8d8375f20af14f16885134048241706';

const searchBar = document.querySelector('.weather__search');
const button = document.querySelector('.weather__submit');
const weatherCards = document.querySelector('.weather__cards');
const mainCard = document.querySelector('.weather__card--main')
const cards = document.querySelectorAll('.weather__card')
const loadingBar = document.querySelector('.weather__loading');

async function getWeather(location) {
    let response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7`, {mode: "cors"});
    let data = await response.json();

    return ({
        locationName: data.location.name,
        currentIcon: data.current.condition.icon,
        currentTemp: data.current.temp_c,
        forecast: data.forecast.forecastday   
    });
}

async function submitCity(e = "") {
    if (e) e.preventDefault(); 

    turnLoading("on");

    const data = await getWeather(searchBar.value ? searchBar.value : "London");

    displayWeather(data);

    turnLoading("off");
}

function displayWeather(data) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const date = new Date();

    let counter = date.getDay();

    const mainCardWeek = mainCard.querySelector('.weather__card--week');
    const mainCardDate = mainCard.querySelector(".weather__card--date");
    const mainCardCity = mainCard.querySelector(".weather__card--city");
    const mainCardWeather = mainCard.querySelector(".weather__card--weather span");
    const mainCardImg = mainCard.querySelector(".weather__card--img");

    mainCardWeek.textContent = daysOfWeek[date.getDay()];
    mainCardDate.textContent = date.getDate() + ', ' + month[date.getMonth()];
    mainCardCity.textContent = data.locationName;
    mainCardWeather.textContent = Math.round(data.currentTemp);
    mainCardImg.src = 'https:' + data.currentIcon;

    cards.forEach((card, i) => {
        if (counter == 6) counter = 0;
        else counter += 1;

        const cardData = data.forecast[i + 1];

        const cardWeek = card.querySelector(".weather__card--date");
        const cardMaxTemp = card.querySelector('.weather__card--weather span');
        const cardMinTemp = card.querySelector('.weather__card--subweather span');
        const cardImg = card.querySelector('.weather__card--img');

        cardWeek.textContent = daysOfWeek[counter];
        cardMaxTemp.textContent = Math.round(cardData.day.maxtemp_c);
        cardMinTemp.textContent = Math.round(cardData.day.mintemp_c);
        cardImg.src = 'https:' + cardData.day.condition.icon;
    });
}

function turnLoading(turn = "on") {
    if (turn == "on") {
        loadingBar.classList.remove('hidden');
        weatherCards.classList.add('hidden');
    }
    else {
        loadingBar.classList.add('hidden');
        weatherCards.classList.remove('hidden');
    }
}

submitCity();

button.addEventListener('click', submitCity);