import axios from 'axios';
import { getDate, setIcons, createImage, getCityInfo, postData } from './helpers';

const baseURL = 'http://api.geonames.org/searchJSON';
  // const baseURL = 'http://api.geonames.org/postalCodeSearchJSON?placename=';
const apiKey = 'username=jcbhass';
// const apiKey = '&appid=&username=jcbhass';

const serverUrl = 'http://localhost:5000';


document.getElementById('generate').addEventListener('click', performAction);

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

      console.log('===Project Data ===', projectData);
      // Displays today's date

      // Displays image
      const img = createImage(projectData.pictures.hits[0].webformatURL);
      document.getElementById("city_picture").appendChild(img);


      // Displays city and trip information
      document.getElementById('trip_info').innerHTML = `Your trip to ${projectData.city}, ${projectData.state} is ${projectData.daysTill} days away and will last ${projectData.durationOfTrip} days.`;
     
      //Displays Skycon animation
      const icon = projectData.forecast.currently.icon
      setIcons(icon, document.getElementById('icon1'));

      // Displays weather information
      document.getElementById('current_forecast').innerHTML = `The weather forecast for ${projectData.startTrip} is ${(projectData.forecast.currently.summary).toLowerCase()} with a temperature of ${projectData.forecast.currently.temperature}&deg.`;
      
      console.log('Current Forecast====', projectData.forecast)
      console.log('Pictures====', projectData.pictures)
    }
  
  } catch(error) {
    console.log("error", error); 
  }
}

//Remove
export { performAction, getDate }




