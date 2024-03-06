// index.js
const weatherMap = {
  'Sunny': 'Sunny',
  'Cloudy' : 'Cloudy',
  'Overcast' : 'Overcast',
  'Rain' : 'Rain',
  'Snow' : 'Snow',
  'Light_rain' : 'Light_rain',
  'Heavy rain' : 'Heavy rain'

}
const weatherColorMap = {
  'Sunny': '#cbeefd',
  'Cloudy': '#deeef6',
  'Overcast': '#c6ced2',
  'Rain': '#c6ced2',
  'Light_rain': '#bdd5e1',
  'Heavy_rain': '#c5ccd0',
  'Snow': '#aae1fc'
 }
Page({
  data: {
    nowTemp: '',
    nowWeather: 'Overcast', 
    nowWeatherBackground: '',
    forecast: []
  },
  onPullDownRefresh(){
    this.getNow(() => {
      wx.stopPullDownRefresh();
    });
  },
  onLoad(){
    this.getNow();
  },
  getNow(callback){
    wx.request({
      url: 'https://www.meteosource.com/api/v1/free/point', 
      data:{
        place_id : "Suzhou",
        key :"el80uvgaa0bsbaom249itfcd2kg93nnzdr4ok6jk",
        timezone : "auto",
        units : "metric",
        sections : "hourly"
      },
      success: res => {
        let result = res.data.hourly.data;
        this.setNow(result);
        console.log(result);
        this.setHourlyForecast(result);
      },
      complete: () =>{
        callback && callback() //check to see if it is defined and then run it

      }
    })
  },
  setNow(result){
    let temp = result[0].temperature;
    let weather = result[0].summary;
    console.log(temp);
    //console.log(temp,weather);

    this.setData({
      nowTemp: temp + '°',
      nowWeather: weather,
      nowWeatherBackground: '/components/images/' + weather + '-bg.png'
      
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })

  },
  setHourlyForecast(result){
     //Set forecast
     let forecast = result;
     console.log(forecast[9].weather);
     console.log(forecast[9].temperature);
     let hourlyWeather = [];
     let nowHour = new Date().getHours();
     for (let i = 0; i < 8; i += 1){
       hourlyWeather.push({
       time: (i*3  + nowHour) % 24 + ":00",
       iconPath: '/components/images/' + forecast[i].weather + '-icon.png',
       temp: forecast[i].temperature + "°"
       });
     }
     hourlyWeather[0].time = "Now";
     this.setData({
       hourlyWeather: hourlyWeather
     })
  }
})