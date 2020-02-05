const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip='
const apiKey = '&appid=ded2480664e28367b432793866b6b8c5';

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
          postData('/', data);
      })
      .then(updateUI);
}

const updateUI = async () => {
    // Gets data from the server
    const request = await fetch('/all');

    // Tries Shows the data
    try{
      const projectData = await request.json();
      document.getElementById('date').innerHTML = projectData.date;
      document.getElementById('temp').innerHTML = projectData.temperature+"&deg"+"F";
      document.getElementById('content').innerHTML = projectData.feelings;
  
    }catch(error){
      console.log("error", error);
    }
  }

const getZipCode = async (baseURL, zipCode, apiKey)=>{
  const res = await fetch(baseURL+zipCode+apiKey+'&units=imperial')

  try {
    const data = await res.json();

    return data;
  }  catch(error) {
    console.log("error", error);
    // appropriately handle the error
  }
}


// Async POST
const postData = async ( url = '', data = {})=>{
  try{
  const response = await fetch(url, {
    method: 'POST', 
    credentials: 'same-origin', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header        
  });
}catch(error){
  console.log("error", error);
}

}

