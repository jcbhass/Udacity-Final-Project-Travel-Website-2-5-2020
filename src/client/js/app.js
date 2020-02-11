import axios from 'axios';
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=ded2480664e28367b432793866b6b8c5';

const serverUrl = 'http://localhost:5000';

// Create a new date instance dynamically with JS
function getDate() {
  const d = new Date();
  const newDate = d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();

  return newDate;
}

// Adds click event for #generate button
document.getElementById('generate').addEventListener('click', performAction);

function performAction(event){
    // Gets zipcode and feelings from user input
    const zipCode =  document.getElementById('zip').value;
    const feelings =  document.getElementById('feelings').value;

    // Gets zipcode from Open Weather Map
    getZipCode(baseURL, zipCode, apiKey) 
      .then(function(data){
          // Add data to POST request
          // data.date = (new Date()).toDateString();
          data.date = getDate();
          data.feelings = feelings;
          
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
      document.getElementById('date').innerHTML = projectData.date;
      document.getElementById('temp').innerHTML = projectData.temperature+"&deg"+"F";
      document.getElementById('city').innerHTML = projectData.name;
      document.getElementById('content').innerHTML = projectData.feelings;
  
    }catch(error){
      console.log("error", error);
    }
  }

const getZipCode = async (baseURL, zipCode, apiKey)=>{

  try {
    const res = await axios.get(baseURL+zipCode+apiKey+'&units=imperial');
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