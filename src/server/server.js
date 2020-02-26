let projectData = {};

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const axios = require('axios');

const darkApiURL = process.env.DARKSKY_API;
const darkApiKey = process.env.DARKSKY_KEY;

const pixaBayApiURL = process.env.PIXABAY_API;
const pixaBayApiKey = process.env.PIXABAY_KEY; 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'));


// POST route
app.post('/information', function (req, res) {
   
    projectData = {
        date: req.body.date,
        geoname: {
            lat: req.body.geonames[0].lat,
            long: req.body.geonames[0].lng,
            city: req.body.geonames[0].toponymName,
            state: req.body.geonames[0].adminName1,
            country: req.body.geonames[0].countryName
        },
        startTrip: req.body.start,
        convertedStart: req.body.startParse,
        unixDate: req.body.unixStartDate,
        endTrip: req.body.end,
        daysTill: req.body.until,
        durationOfTrip: req.body.duration
    }

    console.log('POST request received');
    return res.status(200).json('Post Successful!'); 
});


//GET route returns projectData
app.get('/all', async function (req, res) {
    console.log('DATA=====', projectData)
    try {
        const response = await axios.get(`${darkApiURL}/${darkApiKey}/${projectData.geoname.lat},${projectData.geoname.long},${projectData.unixDate}?exclude=minutely,hourly,daily,alerts,flag`);
        projectData.forecast = response.data;
        
        const picResponse = await axios.get(`${pixaBayApiURL}${pixaBayApiKey}&q=${projectData.geoname.city}&image_type=photo`);
        projectData.pictures = picResponse.data;

        if(picResponse.data.hits.length === 0) {
            console.log('Alternate pics used!!!')
            const alternatePicResponse = await axios.get(`${pixaBayApiURL}${pixaBayApiKey}&q=${projectData.geoname.country}&image_type=photo`);
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