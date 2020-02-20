import axios from 'axios';
import { getDate, setIcons, createImage, getZipCode, postData } from './helpers';

// const baseURL = 'http://api.geonames.org/searchJSON?q=';
const baseURL = 'http://api.geonames.org/postalCodeSearchJSON?placename=';
// const apiKey = '&country=us&maxRows=3&username=jcbhass';
const apiKey = '&appid=&username=jcbhass';

// You might have to narrow down the placename in your geonames URL a bit further. Like: http://api.geonames.org/searchJSON?username=<yours here>&country=us&maxRows=3 This hardcodes the country to US

// Or I've seen something like

// const getCoordinatesAPI = async (city, country = '') => { const baseUrl = `http://api.geonames.org/searchJSON?q=${city}&country=${country}&maxRows=3&username=<yours here>`;




const serverUrl = 'http://localhost:5000';


document.getElementById('generate').addEventListener('click', performAction);

function performAction(event){
  // Gets zipcode and feelings from user input
  //Change the zip code to city name and change feelings 
  const zipCode =  document.getElementById('zip').value;
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
    getZipCode(baseURL, zipCode, apiKey) 
      .then(function(data){
        console.log('HEY===',data);
        // Add data to POST request
    
        data.date = getDate();
        data.start = startDate;
        data.startParse = millisecondsBetweenStartTravelAnd1970;
        data.end = endDate;
        data.until = daysTillTravel;
        data.duration = daysTravelDuration;
        data.unixStartDate = unixDate;
        
        console.log('REQ DATA==', data);
        
        // Sends data to the server 
        return postData(`${serverUrl}/`, data);
      })
      .then(updateUI);
}

const updateUI = async () => {
  try{
    // Gets data from the server
    const response = await axios.get(`${serverUrl}/all`);
    const projectData = response.data;
    if(projectData) {

      // const forecastResponse = await axios.get(`${serverUrl}/forecast`);
      // const forecastData = forecastResponse.data;

      console.log('===Project Data ===', projectData);
      // Displays today's date
      document.getElementById('date').innerHTML = projectData.date;

      // Displays state information
      document.getElementById('city').innerHTML = projectData.city;
      document.getElementById('state').innerHTML = projectData.state; 
      document.getElementById('country').innerHTML = projectData.countryCode;

      // Displays travel time frames
      document.getElementById('daysTill').innerHTML = projectData.daysTill; 
      document.getElementById('start').innerHTML = projectData.startTrip;
      document.getElementById('end').innerHTML = projectData.endTrip;
      document.getElementById('duration').innerHTML = projectData.durationOfTrip;
      
      // Displays weather information
      document.getElementById('current_forecast').innerHTML = projectData.forecast.currently.summary;
      
      // Displays image
      const img = createImage(projectData.pictures.hits[0].webformatURL);
      document.getElementById("city_picture").appendChild(img);

      //Displays Skycon animation
      const icon = projectData.forecast.currently.icon
      setIcons(icon, document.getElementById('icon1'));


      console.log('Current Forecast', projectData.forecast)
      console.log('Pictures', projectData.pictures)
    }
  
  } catch(error) {
    console.log("error", error); 
  }
}

export { performAction, getDate }

 