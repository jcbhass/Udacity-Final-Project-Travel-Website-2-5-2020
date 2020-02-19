// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();
/*Dependencies*/
const bodyParser = require('body-parser');
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');

const axios = require('axios');

const darkApiURL = 'https://api.darksky.net/forecast';
const darkApiKey = 'd642919db3884e09597df98337d26058';

const pixaBayApiURL = 'https://pixabay.com/api/?key=';
const pixaBayApiKey = '15202003-ed24c6df5b5db575c48c9bbdd'; 


const restCountriesApiURL = 'https://restcountries.eu/rest/v2/alpha?codes='; 
//https://restcountries.eu/rest/v2/alpha?codes={code};{code};{code}
//restcountries, "alpha2Code": "SE",
//geocodes, countryCode: "SE"

//https://restcountries.eu/rest/v2/all
//https://restcountries.eu/rest/v2/name/


app.use(cors());
// Initialize the main project folder
app.use(express.static('dist'));

// Setup Server
const port = 5000;
//Spin up server
const server = app.listen(port, listening);
// or const server = app.listen(port, ()=>{console.log(`running on localhost: ${port}`)})
//Callback to debug
function listening() {
    console.log('server running');
    console.log(`running on localhost: ${port}`);
};

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// POST route
app.post('/', function (req, res) {
    console.log('======', req.body);
    projectData.date = req.body.date;
    projectData.lat = req.body.postalCodes[0].lat;
    projectData.long = req.body.postalCodes[0].lng;
    projectData.city = req.body.postalCodes[0].placeName;
    projectData.state = req.body.postalCodes[0].adminName1;
    projectData.adminName2 = req.body.postalCodes[0].adminName2;
    projectData.countryCode = req.body.postalCodes[0].countryCode;
    projectData.startTrip = req.body.start;
    projectData.convertedStart = req.body.startParse;
    projectData.unixDate = req.body.unixStartDate;
    projectData.endTrip = req.body.end;
    projectData.daysTill = req.body.until;
    projectData.durationOfTrip = req.body.duration;
    // projectData.cityPictures = req.body.pictures.hits[0].webformatURL;
    
    console.log('POST request received');
    return res.status(200).json('Success!'); 
});


//GET route returns projectData
app.get('/all', async function (req, res) {
    try {
        const response = await axios.get(`${darkApiURL}/${darkApiKey}/${projectData.lat},${projectData.long},${projectData.unixDate}?exclude=minutely,hourly,daily,alerts,flag`);
        
        const picResponse = await axios.get(`${pixaBayApiURL}${pixaBayApiKey}&q=${projectData.adminName2}&image_type=photo`);
       
        projectData.forecast = response.data;
        projectData.pictures = picResponse.data;
        
        return res.send(projectData); 
    } catch (error) {
        return res.status(500).json(error.message)
    }
});

// //TESTING GET route returns projectData
// app.get('/all', async function (req, res) {
//     const darkApiRecentRequest =  `${darkApiURL}/${darkApiKey}/${projectData.lat},${projectData.long},${projectData.unixDate}?exclude=minutely,hourly,daily,alerts,flag`;
//     const darkApiRecentGet = axios.get(darkApiRecentRequest);
//     const pixaBayRequest = `${pixaBayApiURL}${pixaBayApiKey}&q=${projectData.state}&image_type=photo`;
//     const pixaBayRequestGet = axios.get(pixaBayRequest);
//     const restCountriesRequest = `${restCountriesApiURL}${projectData.countryCode}`;
//     const restCountriesGet = axios.get(restCountriesRequest);
    

//     await axios.all([darkApiRecentGet, pixaBayRequestGet, restCountriesGet]).then(axios.spread((...response) => {
//         projectData.forecast = response.data[0];
//         projectData.pictures = response.data[1];
//         projectData.restCountries = response.data[2];

//     })).catch(error => {
//         console.log('Get Error', error)
//     })
    

//     res.send(projectData);
//     console.log('====GET REQUEST DATA====', projectData)
//     console.log('GET request received')
// })

// //GET route returns projectData
// app.get('/all', async function (req, res) {
//     const response = await axios.get(`${darkApiURL}/${darkApiKey}/${projectData.lat},${projectData.long}`);
//     // const picResponse = await axios.get(`${pixaBayApiURL}?key=${pixaBayApiKey}&q=${projectData.city}&image_type=photo`)
//     projectData.forecast = response.data;
//     // projectData.pictures = picResponse.data;
//     res.send(projectData); 
//     console.log('GET request received')
// });












// GET route returns projectData
// app.get('/all', async function (req, res) {
//     const response = await axios.get(`${darkApiURL}/${darkApiKey}/${projectData.lat},${projectData.long}`);
//     // const picResponse = await axios.get(`${pixaBayApiURL}?key=${pixaBayApiKey}&q=${projectData.city}&image_type=photo`)
//     projectData.forecast = response.data;
//     // projectData.pictures = picResponse.data;
//     res.send(projectData); 
//     console.log('GET request received')
// });




// app.get('/forecast', async function(req, res) {
//     const response = await axios.get(`${darkApiURL}/${darkApiKey}/${projectData.lat},${projectData.long}`);
//     return res.status(200).json(response.data);
// })

