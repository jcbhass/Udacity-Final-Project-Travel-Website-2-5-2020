import axios from 'axios';
import { getDate, getIcons, createImage, getCityInfo, postData } from './helpers';

// Geonames base api url 
const baseURL = process.env.GEONAMES_API;
const apiKey = process.env.GEONAMES_KEY;

const serverUrl = 'http://localhost:5000';

// Takes user input
function performAction(event){
  // Gets city and dates from user input
  const cityName =  document.getElementById('city').value;
  const startDate = document.getElementById('trip-start').value;
  const endDate = document.getElementById('trip-end').value;

  //Calculate days till travel start date
  let millisecondsBetweenStartTravelAnd1970 = Date.parse(startDate);
  let millisecondsBetweenNowAnd1970 = Date.parse(getDate());
  let millisecondsBetweenEndTravelAnd1970 = Date.parse(endDate);
  let millisecondsTillTravel = millisecondsBetweenStartTravelAnd1970-millisecondsBetweenNowAnd1970;
  let daysTillTravel = Math.round(millisecondsTillTravel/(1000*60*60*24));

  //Convert time (mm/dd/yyyy) to ISO/Unix timest
  //https://www.experts-exchange.com/questions/21158791/convert-mm-dd-YYYY-to-timestamp-in-javascript.html
  function toUnixStamp(str) 
  {
     var s=str.split("/");
      if(s.length>1)
      return (new Date(Date.UTC(s[2],(s[0]*1-1),(s[1]*1+1),0,0,0)).getTime()/1000.0);
  };
  let unixDate = toUnixStamp(startDate);


  //Calculate days from travel start date to end date. 
  let millisecondsTravelDuration = millisecondsBetweenEndTravelAnd1970-millisecondsBetweenStartTravelAnd1970;
  let daysTravelDuration = Math.round(millisecondsTravelDuration/(1000*60*60*24));


    // Gets longitude and latitude from Geonames website
    getCityInfo(baseURL, cityName, apiKey) 
      .then(function(data){
        console.log('HEY===',data);
        // Adds data to POST request
    
        data.date = getDate();
        data.start = startDate;
        data.startParse = millisecondsBetweenStartTravelAnd1970;
        data.end = endDate;
        data.until = daysTillTravel;
        data.duration = daysTravelDuration;
        data.unixStartDate = unixDate;
        
        console.log('REQ DATA==', data);
        
        // Sends data to the server 
        return postData(`${serverUrl}/information`, data);
      })
      .then(updateUI);
}

// Shows data onto browser
const updateUI = async () => {
  try{
    // Gets data from the server
    const response = await axios.get(`${serverUrl}/all`);
    const projectData = response.data;
    if(projectData) {

      console.log('===Project Data ===', projectData);

      // Displays city image
      const img = createImage(projectData.pictures.hits[0].webformatURL);
      document.getElementById("city_picture").appendChild(img);


      // Displays city and trip information
      document.getElementById('trip_info').innerHTML = `Your trip to ${projectData.geoname.city}, ${projectData.geoname.state} is ${projectData.daysTill} day(s) away and will last ${projectData.durationOfTrip} days.`;
     
      // Displays Skycon animation
      const icon = projectData.forecast.currently.icon
      getIcons(icon, document.getElementById('icon1'));

      // Displays weather information
      document.getElementById('current_forecast').innerHTML = `The weather forecast for ${projectData.startTrip} is ${(projectData.forecast.currently.summary).toLowerCase()} with a temperature of ${projectData.forecast.currently.temperature}&deg.`;
      
      console.log('Current Forecast====', projectData.forecast)
      console.log('Pictures====', projectData.pictures)
    }
  
  } catch(error) {
    console.log("error", error); 
  }
}

document.getElementById('generate').addEventListener('click', performAction);





  