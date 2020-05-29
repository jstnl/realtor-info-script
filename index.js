const axios = require('axios');
const qs = require('querystring');
const HTMLParser = require('node-html-parser');

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const vancouverParams = {
  ZoomLevel: 8,
  LatitudeMax: 49.99940,
  LongitudeMax: -120.48898,
  LatitudeMin: 48.56621,
  LongitudeMin: -125.65804,
  Sort: '1-A',
  PropertyTypeGroupID: 1,
  PropertySearchTypeId: 1,
  TransactionTypeId: 2,
  Currency: 'CAD',
  RecordsPerPage: 10,
  ApplicationId: 1,
  CultureId: 1,
  Version: '7.0',
  CurrentPage: 1,
}

const requestListings = (page) => {
  return axios.post('https://api2.realtor.ca/Listing.svc/PropertySearch_Post', qs.stringify(vancouverParams), config);
}

const getRelativeUrlInfo = (relativeUrl) => {
  return axios.get('https://www.realtor.ca/' + relativeUrl);
}

requestListings(1).then((res) => {
  console.log(res.data.Results);
  res.data.Results.forEach((listing => {
    const data = {};
    data.mlsNumber = listing.MlsNumber;
    data.address = listing.Property.Address.AddressText;
    data.price = listing.Property.Price;

    // Strata info is on relative page
    getRelativeUrlInfo(listing.RelativeURLEn)
      .then((res) => {
        const root = HTMLParser.parse(res.data);
        console.log(root);
      })
      .catch((err) => {
        console.log(err);
      });
    

    console.log(data);
  }))
})
.catch((err) => {
  console.log(err);
})
