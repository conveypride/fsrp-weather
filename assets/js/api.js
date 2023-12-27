 

'use strict';

// const yekapi = "9f9083ea020d946b3e637d6e695fac79";
const yekapi = "fd47e14dc779c51029291bd5188d9262";
/**
 * Fetch data from server
 * @param {string} URL API url
 * @param {Function} callback callback
 */

export const fetchData = function (URL, callback) {
  fetch(`${URL}&appid=${yekapi}`)
    .then(res => res.json())
    .then(data => callback(data));
}



export const url = {
  currentWeather(lat, lon) {
    return `https://api.openweathermap.org/data/3.0/onecall?${lat}&${lon}&units=metric`
  },
  forecast(lat, lon) {
    return `https://api.openweathermap.org/data/3.0/onecall?${lat}&${lon}&units=metric`
  },
  
 forecast14days(lat, lon, date) {
    return `https://api.openweathermap.org/data/3.0/onecall/day_summary?${lat}&${lon}&date=${date}`
  },
   getmap() {
    return `https://maps.openweathermap.org/maps/2.0/weather/TA2/0/1/1?`
  },
  airPollution(lat, lon) {
    return `http://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`
  },
  reverseGeo(lat, lon) {
    return `http://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`
  },
  /**
   * @param {string} query Search query e.g.: "accra", "ghana"
   */
  geo(query) {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
  }
}