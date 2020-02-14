import axios from 'axios';
const baseURL = 'http://api.geonames.org/postalCodeSearchJSON?placename=';
const apiKey = '&appid=&username=jcbhass';

const pixelBayApiURL = '';
const pixelBayApiKey = '';

const serverUrl = 'http://localhost:5000';

// Create a new date instance dynamically with JS
function getDate() {
  const d = new Date();
  const newDate = d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();

  return newDate;
}

document.getElementById('generate').addEventListener('click', performAction);

function performAction(event){
    // Gets zipcode and feelings from user input
    const zipCode =  document.getElementById('zip').value;
    const travelDate =  document.getElementById('travelToDate').value;
    const startDate = document.getElementById('start').value;

    // Gets zipcode from Open Weather Map
    getZipCode(baseURL, zipCode, apiKey) 
      .then(function(data){
          // Add data to POST request
          // data.date = (new Date()).toDateString();
          data.date = getDate();
          data.travelDate = travelDate;
          data.start = startDate;

          console.log('REQ DATA==', data)
          
          // Sends data to the server 
          return postData(`${serverUrl}/`, data);
      })
      .then(updateUI);
}

const updateUI = async () => {
    
    // Tries Shows the data
    try{
      // Gets data from the server
      const response = await axios.get(`${serverUrl}/all`);
      const projectData = response.data;
      if(projectData) {

        // const forecastResponse = await axios.get(`${serverUrl}/forecast`);
        // const forecastData = forecastResponse.data;

        console.log('===Project Data ===', projectData);
        document.getElementById('date').innerHTML = projectData.date;
        document.getElementById('lat').innerHTML = projectData.lat;
        document.getElementById('long').innerHTML = projectData.long;
        document.getElementById('city').innerHTML = projectData.city;
        document.getElementById('country').innerHTML = projectData.countryCode;
        document.getElementById('travel_date').innerHTML = projectData.travelDate;
        document.getElementById('start').innerHTML=projectData.startDate;

        document.getElementById('forecast').innerHTML = projectData.forecast.minutely.summary;
      }
  
    }catch(error){
      console.log("error", error);
    }
  }

const getZipCode = async (baseURL, zipCode, apiKey)=>{

  try {
    const res = await axios.get(baseURL+zipCode+apiKey);
    return res.data;
  }  catch(error) {
    console.log("error", error);
    // appropriately handle the error
  }
}



// Async POST
const postData = async ( url, data)=>{
  try{
  const response = await axios.post(url, data);
  return  response.data;
}catch(error){
  console.log("error", error);
}

}

export { performAction, getDate }

//Calculate days till travel date
// let startTravel =  document.getElementById('start').value
// let millisecondsBetweenStartTravelAnd1970 = Date.parse(startTravel);
// const millisecondsBetweenNowAnd1970 = Date.now();
// let millisecondsTillTravel = millisecondsBetweenStartTravelAnd1970-millisecondsBetweenNowAnd1970;
// let daysTillTravel = millisecondsTillTravel*1000*60*60*24;