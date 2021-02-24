// Open Weather Map API by: https://openweathermap.org/
const api = {
    key: "3ef65882f94eb3c640df1c2f18fc9fc3",
    base: "https://api.openweathermap.org/data/2.5/"
};

const searchBox = document.querySelector('.search-box');
searchBox.addEventListener('keypress', setQuery);

init();

function setQuery(event){
    // 13은 Enter의 keyCode 값이다!!
    if(event.keyCode == 13){
        getInfo(searchBox.value);
    }
}

// API서버에서 데이터 get하기
function getInfo(city){
    
    fetch(`${api.base}weather?q=${city}&units=metric&APPID=${api.key}`)
    .then((weather) => {return weather.json();})
    .then(displayResults)
    .catch(e => {
        alert("The name of the city does not exist");
        searchBox.value = "";
        return;
    });
   
}

function displayResults(weather){

    // 도시이름 나라이름 출력
    let city = document.querySelector('.city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    // 요일, 일, 월, 년 정보 가지고오기
    let date = document.querySelector('.date');
    date.innerText = getDate(weather);

    // 기온 날씨 최저/최고온도 정보 가져오기
    let weather_info = document.querySelector('.weather-info');
    let w_info_array = get_weather_info(weather);

    // 현재 기온
    let temp = document.querySelector('.temp');
    temp.innerText = `${w_info_array[0]}°c`;

    // 금일 최고 기온/ 최저기온
    let hi_low = document.querySelector('.hi-low');
    hi_low.innerText = `${w_info_array[1]}°c/${w_info_array[2]}°c`;

    // 현재 날씨상태
    let w = document.querySelector('.weather');
    w.innerText = `${w_info_array[3]}`;

    // 현재 날씨에 해당되는 배경 불러오기
    getbackgroundColor(w_info_array[3]);

    // 현재 날씨에 해당되는 아이콘 API서버로부터 불러오기
    let icon = document.querySelector('.icon');
    let icon_url = `http://openweathermap.org/img/wn/${w_info_array[4]}@2x.png`;
    icon.style.backgroundImage = `url(${icon_url})`;

    // 현재 날씨 부연설명
    let weather_desc = document.querySelector('.weather-desc');
    weather_desc.innerText = `Description: ${w_info_array[5]}`;

    let rise_set = get_rise_set_time(weather);
    
    // 검색어 리셋하기
    searchBox.value ="";
}

function get_rise_set_time(weather){
    let arr = [];
    // 일몰 일출시간 계산법 by https://stackoverflow.com/questions/60627245/openweather-api-time-always-in-my-local-time-zone
    let sunrise = new Date((weather.sys.sunrise+weather.timezone)*1000);
    let sunset = new Date((weather.sys.sunset+weather.timezone)*1000);
    
    let rise = [];
    rise.push((sunrise.getHours())%12);
    rise.push(sunrise.getMinutes());

    let set =[];
    set.push((sunset.getHours())%12);
    set.push(sunset.getMinutes());

    arr.push(rise, set);
    
}

// 현재 날씨에대한 기온/최고최저 기온/날씨상태/설명/아이콘 배열에 저장후 리턴
function get_weather_info(weather){
    let arr = [];
    arr.push(parseInt(weather.main.temp));
    arr.push(parseInt(weather.main.temp_min));
    arr.push(parseInt(weather.main.temp_max));
    arr.push(weather.weather[0].main);
    arr.push(weather.weather[0].icon);
    arr.push(weather.weather[0].description);
    return arr;
}

//검색한 도시 현재 시간 가져오기
function getDate(weather){
    const months = ['January', 'February','March', 'April', 'May', 'June', 'July', 'Agust'
                    ,'September','October','November','December'];
    const days = ['sunday','Monday','Tuesday','Wendsday','Thursday','Friday','Saturday'];
    
    let current_date = new Date(weather.dt*1000-(weather.timezone*1000));
    let year = current_date.getFullYear();
    let month = months[current_date.getMonth()];
    let date = current_date.getDate();
    let day = days[current_date.getDay()];
    
    return `${day} ${date} ${month} ${year}`;
}

// 해당날씨에 알맞은 이미지로 배경 이미지 변경
function getbackgroundColor(weather_type){
    const backgroudImg = document.querySelector('.container');

    if(weather_type === "Smoke" || weather_type === "Dust" || weather_type == "Sand" 
    || weather_type ==="Dust" || weather_type === "Ash" || weather_type ==="Squall"){
        weather_type = "Haze";
    }

    let imageUrl = `./images/${weather_type}.jpg`;
    backgroudImg.style.backgroundImage = `url(${imageUrl})` ;
    
}

function init(){
    getInfo("Seoul");
}