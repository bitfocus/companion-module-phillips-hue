
'use strict';

const v3 = require('node-hue-api').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const LightState = v3.lightStates.LightState;

// Replace this with your username for accessing the bridge
const USERNAME = "xH8d29uzrAMxEjYQ8Lk4rMq8tli6coL3m50aRAJo"
  // The name of the light we wish to retrieve by name
;

function setLight_Switch(user,id,onoff){
  if (onoff == 'true') {
    onoff = true
  }
  if (onoff == 'false') {
    onoff = false;
  }
   v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(user);
    })
    .then(api => {
      // Using a LightState object to build the desired state
      const state = new LightState()
      .on(onoff)
      ;
      return api.lights.setLightState(id, state);
    })
    .then(result => {
      console.log(`Light state ONOFF change was successful? ${result}`);
    })
  ;
}
function setLight_Switch_Bri(user,id,onoff,bri){
  if (onoff == 'true') {
    onoff = true
  }
  if (onoff == 'false') {
    onoff = false;
  }
   v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(user);
    })
    .then(api => {
      // Using a LightState object to build the desired state
      const state = new LightState()
      .on(onoff)
      .bri(bri)
      ;
      return api.lights.setLightState(id, state);
    })
    .then(result => {
      console.log(`Light state ONOFF change was successful? ${result}`);
    })
  ;
}
function setLight_Switch_Bri_Ct(id,onoff,bri,ct){
  if (onoff == 'true') {
    onoff = true
  }
  if (onoff == 'false') {
    onoff = false;
  }
   v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .then(api => {
      // Using a LightState object to build the desired state
      const state = new LightState()
      .on(onoff)
      .bri(bri)
      .ct(ct)
      ;
      return api.lights.setLightState(id, state);
    })
    .then(result => {
      console.log(`Light state ONOFF change was successful? ${result}`);
    })
  ;
}

module.exports = {
setLight_Switch,
setLight_Switch_Bri,
setLight_Switch_Bri_Ct,
}
