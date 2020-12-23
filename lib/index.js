
'use strict';

const v3      = require('node-hue-api').v3
  , LIGHTS    = require('./getAllLights')
  , GROUPS    = require('./getAllGroups')
;
async function test(){
  let data = await LIGHTS.getAllLights();
  //let data2 = await GROUPS.getAllRooms();
  //let data3 = await GROUPS.getAllZones();
  let data4 = await GROUPS.getAllLightGroups();
  console.log(data4);
  console.log(Object.keys(data));

}
//test();
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

//const USERNAME = require('../../../test/support/testValues').username;
const USERNAME = "xH8d29uzrAMxEjYQ8Lk4rMq8tli6coL3m50aRAJo"
  // The name of the light we" wish to retrieve by name
  , LIGHT_ID = 1
;

// v3.discovery.nupnpSearch()
//   .then(searchResults => {
//     const host = searchResults[0].ipaddress;
//     return v3.api.createLocal(host).connect(USERNAME);
//   })
//   .then(api => {
//     // Using a basic object to set the state
//     return api.lights.setLightState(LIGHT_ID, {on: true});
//   })
//   .then(result => {
//     console.log(`Light state change was successful? ${result}`);
//   })
// ;


module.exports = {

}
