const $ = document;


const changeLocationBtn = $.querySelector('.change-location');
const inputContainer = $.querySelector('.hidden-input');
const inputCountry = $.querySelector('input');
const enterInput = $.querySelector('.enter');
const weekList = $.querySelectorAll('.week-list li');

let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let days_sh = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

changeLocationBtn.addEventListener('click', () => {
    inputContainer.classList.remove('hidden');
    changeLocationBtn.classList.add('hidden');
})
window.addEventListener('load', () => {
    dateUpdater();

    // if (localStorage.getItem('city')) {
    //     let citySaver = localStorage.getItem('city');
    //     console.log(citySaver);
    //     fetchingData(citySaver, 0);

    // }
})
enterInput.addEventListener('click', () => {
    fetchingData(inputCountry.value, 0);
    inputCountry.value = '';

    inputContainer.classList.add('hidden');
    changeLocationBtn.classList.remove('hidden');
})

inputCountry.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
        fetchingData(inputCountry.value, 0)
        inputCountry.value = '';

        inputContainer.classList.add('hidden');
        changeLocationBtn.classList.remove('hidden');
    }
})

function fetchingData(cityValue, cnt) {
    const url = {
        url: 'https://api.openweathermap.org/data/2.5/forecast?',
        key: 'a77f2b47c87a399d4961123d72663cb6'
    }
    fetch(`${url.url}q=${cityValue}&cnt=4&appid=${url.key}`)
        .then(res => res.json())
        .then(data => {
            // localStorage.setItem('city', cityValue);

            const countryName = $.querySelector('.country-name');

            countryName.innerHTML = `${data.city.name}, ${data.city.country}`

            const weatherTodayIcon = $.querySelector('.weather-desc-icon img');
            const weatherTodayTemp = $.querySelector('.weather-temp');
            const weatherTodaydesc = $.querySelector('.weather-desc');

            setWeatherIcon(weatherTodayIcon, data.list[cnt].weather[0].main);
            weatherTodayTemp.innerHTML = `${kelvinTocelsius(data.list[cnt].main.temp)}°C`;
            weatherTodaydesc.innerHTML = data.list[cnt].weather[0].main;

            const precipitation = $.querySelector('.precipitation .value');
            const humidity = $.querySelector('.humidity .value');
            const wind = $.querySelector('.wind .value');

            precipitation.innerHTML = `${data.list[cnt].pop} %`;
            humidity.innerHTML = `${data.list[cnt].main.humidity} %`;
            wind.innerHTML = `${data.list[cnt].wind.speed} m/s`;

            let dayIcon = $.querySelectorAll('.day-icon img');
            let dayTemp = $.querySelectorAll('.day-temp');

            let numofIcon = 0;
            let numofTemp = 0;

            dayIcon.forEach(icon => {
                if (numofIcon > 4) {
                    numofIcon = 0;
                }
                setWeatherIcon(icon, data.list[numofIcon].weather[0].main);
                numofIcon += 1;
            })

            dayTemp.forEach(temp => {
                if (numofTemp > 4) {
                    numofTemp = 0;
                }
                temp.innerHTML = `${kelvinTocelsius(data.list[numofTemp].main.temp)}°C`;
                numofTemp += 1;
            })

            changeDay(cityValue);

        })
        .catch(err => console.log(err))
}

function kelvinTocelsius(kelvinData) {
    return (kelvinData - 273).toFixed();
}

function setWeatherIcon(weatherIcon, weatherMode) {
    switch (weatherMode) {
        case 'sunny':
            weatherIcon.src = './icons/sunny.svg';
            break;
        case 'snowy':
            weatherIcon.src = './icons/snowy.svg';
        case 'clouds':
            weatherIcon.src = './icons/cloudy.svg';
        case 'rainy':
            weatherIcon.src = './icons/rainy.svg';
        default:
            weatherIcon.src = './icons/cloudy.svg';
            break;
    }
}

function dateUpdater() {
    let date = new Date();

    let day = $.querySelector('.week-day');
    let nowmonthyear = $.querySelector('.nowmonthyear');

    day.innerHTML = days[date.getDay()];
    nowmonthyear.innerHTML = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;

    let daynames = $.querySelectorAll('.day-name');
    let numofday = date.getDay();

    daynames.forEach(day => {
        if (numofday > 6) {
            numofday = 0;
        }
        day.innerHTML = days_sh[numofday];
        numofday += 1;
    })
}

function changeDay(city) {
    weekList.forEach(li => {
        li.addEventListener('click', () => {
            let curentLi = $.querySelector('.week-list li.active');
            curentLi.className = '';
            li.classList.add('active');
            fetchingData(city, li.dataset.id);
        })
    })
}