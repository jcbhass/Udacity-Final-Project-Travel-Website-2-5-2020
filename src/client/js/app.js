import axios from 'axios';
const baseURL = 'http://api.geonames.org/postalCodeSearchJSON?placename=';
const apiKey = '&appid=&username=jcbhass';

// https://stackoverflow.com/questions/2735881/adding-images-to-an-html-document-with-javascript
// var img = document.createElement("img");
// img.src = "http://www.google.com/intl/en_com/images/logo_plain.png";
// var src = document.getElementById("city_picture");
// src.appendChild(img);




const serverUrl = 'http://localhost:5000';

function createImage(imageSrc) {
  const img = document.createElement("img");
    img.src = imageSrc;
    img.style = "width: 300px; height: 300px";

    return img;
}

//Skycon
function setIcons(icon, iconID) {
  const skycons = new Skycons({ color: 'black'})
  const currentIcon = icon.replace(/-/g, '_').toUpperCase();
  skycons.play();
  return skycons.set(iconID, Skycons[currentIcon]);
}


// Create a new date instance dynamically with JS
function getDate() {
  const d = new Date();
  const today = `${d.getMonth()+1}.${d.getDate()}.${d.getFullYear()}`;

  return today;
}

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

  //Convert time to ISO format 
  //https://www.experts-exchange.com/questions/21158791/convert-mm-dd-YYYY-to-timestamp-in-javascript.html
  function toUnixStamp(str) // Converts mm/dd/yyyy format to Unix timestamp
  {
     var s=str.split("/");
      if(s.length>1)
      return (new Date(Date.UTC(s[2],(s[0]*1-1),(s[1]*1+1),0,0,0)).getTime()/1000.0);
  };
  let unixDate = toUnixStamp(startDate);


  //Calculate days from travel start date to end date. 
  let millisecondsTravelDuration = millisecondsBetweenEndTravelAnd1970-millisecondsBetweenStartTravelAnd1970;
  let daysTravelDuration = (millisecondsTravelDuration/(1000*60*60*24));


    // Gets longitude and latitude from Geonames website
    getZipCode(baseURL, zipCode, apiKey) 
      .then(function(data){
        // Add data to POST request
        // data.date = (new Date()).toDateString();
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
      document.getElementById('city').innerHTML = projectData.city;
      document.getElementById('state').innerHTML = projectData.state; 
      document.getElementById('country').innerHTML = projectData.countryCode;
      document.getElementById('daysTill').innerHTML = projectData.daysTill; 
      document.getElementById('start').innerHTML = projectData.startTrip;
      document.getElementById('end').innerHTML = projectData.endTrip;
      document.getElementById('duration').innerHTML = projectData.durationOfTrip;
 
      document.getElementById('current_forecast').innerHTML = projectData.forecast.currently.summary;
      // document.getElementById('icon1').innerHTML = projectData.forecast.currently.icon;

      
      // display image
      const img = createImage(projectData.pictures.hits[0].webformatURL);
      document.getElementById("city_picture").appendChild(img);

      //skycon
      const icon = projectData.forecast.currently.icon
      setIcons(icon, document.getElementById('icon1'));


      console.log('Current Forecast', projectData.forecast)
      console.log('Pictures', projectData.pictures)
  



      // https://stackoverflow.com/questions/2735881/adding-images-to-an-html-document-with-javascript
      // function insert() { 
      //   let img = document.createElement('img');
      //   let src = document.getElementById('city_picture');
  
      //   img.src = `projectData.pictures.;
      //   src.appendChild(img);
      // }

      
    }
  
  } catch(error) {
    console.log("error", error); 
  }
}

const getZipCode = async (baseURL, zipCode, apiKey)=>{

  try {
    const res = await axios.get(baseURL+zipCode+apiKey);
    return res.data;
  } catch(error) {
    console.log("error", error);
    // appropriately handle the error
  }
}



// Async POST
const postData = async ( url, data)=>{
  try{
    const response = await axios.post(url, data);
    return  response.data;
  } catch(error) {
    console.log("error", error);
}

}

export { performAction, getDate }

