const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const axios = require('axios');

const darkApiURL = 'https://api.darksky.net/forecast';
const darkApiKey = 'd642919db3884e09597df98337d26058';

const pixaBayApiURL = 'https://pixabay.com/api/?key=';
const pixaBayApiKey = '15202003-ed24c6df5b5db575c48c9bbdd'; 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'));

let projectData = {};

// POST route
app.post('/', function (req, res) {
    console.log('======', req.body);
    // projectData = {
    //     date: req.body.date,
    //     lat: req.body.postalCodes[0].lat,
    //     long: req.body.postalCodes[0].lat,
    //     city: req.body.postalCodes[0].placeName
    // }

    projectData.date = req.body.date;
    projectData.lat = req.body.postalCodes[0].lat;
    projectData.long = req.body.postalCodes[0].lng;
    projectData.city = req.body.postalCodes[0].placeName;
    projectData.state = req.body.postalCodes[0].adminName1;
    projectData.countryCode = req.body.postalCodes[0].countryCode;

    projectData.startTrip = req.body.start;
    projectData.convertedStart = req.body.startParse;
    projectData.unixDate = req.body.unixStartDate;
    projectData.endTrip = req.body.end;
    projectData.daysTill = req.body.until;
    projectData.durationOfTrip = req.body.duration;
    
    console.log('POST request received');
    return res.status(200).json('Post Successful!'); 
});


//GET route returns projectData
app.get('/all', async function (req, res) {
    try {
        const response = await axios.get(`${darkApiURL}/${darkApiKey}/${projectData.lat},${projectData.long},${projectData.unixDate}?exclude=minutely,hourly,daily,alerts,flag`);
        projectData.forecast = response.data;
        
        const picResponse = await axios.get(`${pixaBayApiURL}${pixaBayApiKey}&q=${projectData.city}&image_type=photo`);
        projectData.pictures = picResponse.data;
        if(picResponse.data.hits.length === 0) {
            console.log('Alternate pics used!!!')
            const alternatePicResponse = await axios.get(`${pixaBayApiURL}${pixaBayApiKey}&q=${projectData.state}&image_type=photo`);
            projectData.pictures = alternatePicResponse.data;
        }

        return res.send(projectData); 
    } catch (error) {
        return res.status(500).json(error.message)
    }
});

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

module.exports = app;