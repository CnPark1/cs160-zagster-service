require('dotenv').config();
const request = require('supertest');
const app = require('express')();
app.use('/rides', require('./routes/rides'));

describe('API endpoints', () => {

  const ENDPOINTS = [
    '/rides/example',
    '/rides/count',
    '/rides/count/per_month',
    '/rides/count/per_year',
    '/rides/count/per_hour',
    '/rides/count/g5',
    '/rides/count/g5/per_month',
    '/rides/count/g5/per_day'
  ]

  ENDPOINTS.forEach( endpoint => {
    test(endpoint, (done) => {
      request(app).get(endpoint).then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
    });
  });

  const INVALID_ENDPOINTS = [
    '/rides/count/FAKE',
    '/rides/count/FAKE/per_month',
    '/rides/count/FAKE/per_day'
  ]

  INVALID_ENDPOINTS.forEach( endpoint => {
    test(endpoint, (done) => {
      request(app).get(endpoint).then((res) => {
        expect(res.statusCode).toBe(404);
        done();
      });
    });
  });

});
