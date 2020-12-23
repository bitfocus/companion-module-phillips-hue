
'use strict';

const v3 = require('node-hue-api').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

//const USERNAME = require('../../../test/support/testValues').username;
const USERNAME = "xH8d29uzrAMxEjYQ8Lk4rMq8tli6coL3m50aRAJo"
  // The name of the light we wish to retrieve by name
  , LIGHT_ID = 1
;

function setLightState(ID,STATE){
  if (STATE == 'true') {
    STATE = true
  }
  if (STATE == 'false') {
    STATE = false;

  }
  console.log("setLightStateUsingObject.js");
  return v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .then(api => {
      // Using a basic object to set the state
      console.log(ID + " : "+ STATE);
      return api.lights.setLightState(ID, {on: STATE});
    })
    .then(result => {
      console.log(`Light state change was successful? ${result}`);
    })
  ;
}
// setLightState(46,"false");


module.exports = {
setLightState,
}
