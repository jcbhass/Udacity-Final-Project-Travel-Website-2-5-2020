const request = require('supertest');
const axios = require('axios');
const app = require('../server/server');
jest.mock('axios');

describe('API Test', () => {
    const postDataTest = {
        date: new Date(),
        postalCodes: [
            {lat: 'lat', lng: 'lng', placeName: 'placeName', adminName1: 'adminName1', countryCode: 'countryCode'}
        ],
        start: 'tesStart',
        startParse: 'startParse',
        unixStartDate: 'unixStartTest',
        end: 'endTest',
        until: 'untilTest',
        duration: 'durationTest'
    }
    it('[POST: /] It should return information and a picture of the entered city', (done) => {
        request(app)
            .post('/')
            .send(postDataTest)
            .expect(200)
            .end((err, res) => {
                 expect(res.body).toBe('Post Successful!');
                done();
            })
    });

    describe('[GET /all]', () => {
        axios.get.mockImplementation(() => {
            return Promise.resolve({data: {
                hits: [{city: 'Florida', humidity: 40}]
            }});
        });

        beforeEach((done) => {
            request(app)
            .post('/')
            .send(postDataTest)
            .end(() => done())
        });

        it('[GET: /all] It should return information from the urls', (done) => {
            request(app)
                .get('/all')
                .expect(200)
                .end((err, res) => {
                    // console.log('ERR', err);
                    // console.log('RES ====099999 ', res.body);
          
                    expect(res.body).toHaveProperty('date');
                    expect(res.body).toHaveProperty('lat');
                    expect(res.body).toHaveProperty('state');
                    expect(res.body).toHaveProperty('forecast');
                    done();
                })
        });
    })
});