/**
 * @license MIT
 * @fileoverview All module functions
 * @copyright codewithsadee 2023 All rights reserved
 * @author codewithsadee 
 */

'use strict';

export const weekDayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

/**
 * @param {number} dateUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Date String. formate: "Sunday 10, Jan"
 */
// export const getDate = function (dateUnix, timezone) {
//   const date = new Date((dateUnix + timezone) * 1000);
//   const weekDayName = weekDayNames[date.getUTCDay()];
//   const monthName = monthNames[date.getUTCMonth()];

//   return `${weekDayName} ${date.getUTCDate()}, ${monthName}`;
// }

export const getDate = function (dateUnix, timezone) {
  const date = new Date(dateUnix * 1000); // Convert Unix timestamp to milliseconds
  const utcOffset = getTimezoneOffsetInMinutes(timezone);
  date.setUTCMinutes(date.getUTCMinutes() + utcOffset);

  const weekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const weekDayName = weekDayNames[date.getUTCDay()];
  const monthName = monthNames[date.getUTCMonth()];

  return `${weekDayName} ${date.getUTCDate()}, ${monthName}`;
}

function getTimezoneOffsetInMinutes(timezone) {
  const now = new Date();
  const timezoneDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  const utcOffset = (now - timezoneDate) / (60 * 1000);
  return utcOffset;
}









/**
 * @param {number} timeUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Time string. formate: "HH:MM AM/PM"
 */
// export const getTime = function (timeUnix, timezone) {
//   const date = new Date((timeUnix + timezone) * 1000);
//   const hours = date.getUTCHours();
//   const minutes = date.getUTCMinutes();
//   const period = hours >= 12 ? "PM" : "AM";

//   return `${hours % 12 || 12}:${minutes} ${period}`;
// }

export const getTime = function (timeUnix, timezone) {
  const date = new Date(timeUnix * 1000); // Convert seconds to milliseconds
  const options = {
    timeZone: timezone,
    hour: 'numeric', 
    hour12: true, // Use 12-hour format
  };
  const formattedTime = new Intl.DateTimeFormat('en-US', options).format(date);

  // console.log(formattedTime);
  // Extract hours and period from the formatted time
  const [time, period] = formattedTime.split(' ');

  return `${parseInt(time)}  ${period}`;
};


/**
 * @param {number} timeUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Time string. formate: "HH AM/PM"
 */
// export const getHours = function (timeUnix, timezone) {
//   const date = new Date((timeUnix + timezone) * 1000);
//   const hours = date.getUTCHours();
//   const period = hours >= 12 ? "PM" : "AM";

//   return `${hours % 12 || 12} ${period}`;
// }

export const getHours = function (timeUnix, timezone) {
  const date = new Date(timeUnix * 1000); // Convert seconds to milliseconds
  const options = {
    timeZone: timezone,
    hour: 'numeric',
    hour12: true, // Use 12-hour format
  };
  const formattedTime = new Intl.DateTimeFormat('en-US', options).format(date);

  // Extract hours and period from the formatted time
  const [hours, period] = formattedTime.split(' ');

  return `${parseInt(hours)} ${period}`;
};

 

/**
 * @param {number} mps Metter per seconds
 * @returns {number} Kilometer per hours
 */
export const mps_to_kmh = mps => {
  const mph = mps * 3600;
  return mph / 1000;
}

export const aqiText = {
  1: {
    level: "Good",
    message: "Air quality is considered satisfactory, and air pollution poses little or no risk"
  },
  2: {
    level: "Fair",
    message: "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution."
  },
  3: {
    level: "Moderate",
    message: "Members of sensitive groups may experience health effects. The general public is not likely to be affected."
  },
  4: {
    level: "Poor",
    message: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects"
  },
  5: {
    level: "Very Poor",
    message: "Health warnings of emergency conditions. The entire population is more likely to be affected."
  }
}