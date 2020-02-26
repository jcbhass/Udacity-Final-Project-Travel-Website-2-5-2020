const request = require('supertest');
const axios = require('axios');
const app = require('../server/server');
jest.mock('axios');

describe('API Test', () => {
    const postDataTest = {
        date: new Date(),
        geonames: [
            {lat: 'test lat', lng: 'test longitude', toponymName: 'test toponymName', adminName1: 'test adminName1', countryName: 'test countryName'}
        ],
        start: 'testStart',
        startParse: 'teststartParse',
        unixStartDate: 'testUnixStart',
        end: 'testEnd',
        until: 'testUntil',
        duration: 'testDuration'
    }
    it('[POST: /information] It should return information and a picture of the entered city', (done) => {
        request(app)
            .post('/information')
            .send(postDataTest)
            .expect(200)
            .end((err, res) => {
                 expect(res.body).toBe('Post Successful!');
                done();
            })
    });

    describe('[GET: /all]', () => {
        axios.get.mockImplementation(() => {
            return Promise.resolve({data: {
                hits: [{city: 'Miami', temperature: 80}]
            }});
        });

        beforeEach((done) => {
            request(app)
            .post('/information')
            .send(postDataTest)
            .end(() => done())
        });

        it('[GET: /all] It should return information from the urls', (done) => {
            request(app)
                .get('/all')
                .expect(200)
                .end((err, res) => {
                    expect(res.body).toHaveProperty('date'); 
                    expect(res.body).toHaveProperty('startTrip'); 
                    expect(res.body).toHaveProperty('convertedStart'); 
                    expect(res.body).toHaveProperty('unixDate'); 
                    expect(res.body).toHaveProperty('endTrip'); 
                    expect(res.body).toHaveProperty('daysTill'); 
                    expect(res.body).toHaveProperty('durationOfTrip'); 
                    expect(res.body).toHaveProperty('geoname');
                    expect(res.body).toHaveProperty('forecast');
                    expect(res.body).toHaveProperty('pictures');
                    expect(res.body.geoname).toHaveProperty('lat');
                    expect(res.body.geoname).toHaveProperty('long');
                    expect(res.body.geoname).toHaveProperty('city');
                    expect(res.body.geoname).toHaveProperty('state');
                    expect(res.body.geoname).toHaveProperty('country');
                    done();
                })
        });
    })
});