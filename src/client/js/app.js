import axios from 'axios';
const baseURL = 'http://api.geonames.org/postalCodeSearchJSON?placename=';
const apiKey = '&appid=&username=jcbhass';

var img = document.createElement("img");
img.src = "http://www.google.com/intl/en_com/images/logo_plain.png";
var src = document.getElementById("city_picture");
src.appendChild(img);


// var API_KEY = '15202003-ed24c6df5b5db575c48c9bbdd';
// var URL = "https://pixabay.com/api/?key="+API_KEY+"&q="+encodeURIComponent('red roses');
// $.getJSON(URL, function(data){
// if (parseInt(data.totalHits) > 0)
//     $.each(data.hits, function(i, hit){ console.log(hit.pageURL); });
// else
//     console.log('No hits');
// });



const serverUrl = 'http://localhost:5000';

// Create a new date instance dynamically with JS
function getDate() {
  const d = new Date();
  // const today = d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();
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


    // Gets zipcode from Open Weather Map
    getZipCode(baseURL, zipCode, apiKey) 
      .then(function(data){
        // Add data to POST request
        // data.date = (new Date()).toDateString();
        data.date = getDate();
        data.start = startDate;
        data.end = endDate;

       



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
      // console.log('=====Pictures=====', projectData.pictures)

      document.getElementById('date').innerHTML = projectData.date;
      document.getElementById('lat').innerHTML = projectData.lat;
      document.getElementById('long').innerHTML = projectData.long;
      document.getElementById('city').innerHTML = projectData.city;
      document.getElementById('state').innerHTML = projectData.state;
      document.getElementById('country').innerHTML = projectData.countryCode;
      // document.getElementById('daysTill').innerHTML = projectData.
      document.getElementById('start').innerHTML = projectData.startTrip;
      document.getElementById('end').innerHTML = projectData.endTrip;
      // document.getElementById('duration').innerHTML = projectData.duration;

      document.getElementById('forecast').innerHTML = projectData.forecast.hourly.summary;


      // https://stackoverflow.com/questions/2735881/adding-images-to-an-html-document-with-javascript
      // function insert() { 
      //   let img = document.createElement('img');
      //   let src = document.getElementById('city_picture');
 
      //   img.src = "http://www.google.com/intl/en_com/images/logo_plain.png";
      //   src.appendChild(img);
      // }
      // document.getElementyById('city_picture').appendChild(img) = `${projectData.pictures.hits.largeImageURL}`;

      // //Calculate days till start travel date
    
      // //Calculate days from travel start date to end date. 

      // let millisecondsBetweenStartTravelAnd1970 = Date.parse(projectData.startTrip);
      // const millisecondsBetweenNowAnd1970 = projectData.date;
      // let millisecondsTillTravel = millisecondsBetweenStartTravelAnd1970-millisecondsBetweenNowAnd1970;
      // let daysTillTravel = millisecondsTillTravel*1000*60*60*24;
      // console.log(daysTillTravel);
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

