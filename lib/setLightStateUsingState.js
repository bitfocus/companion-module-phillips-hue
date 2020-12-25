
'use strict';

const v3 = require('node-hue-api').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const LightState = v3.lightStates.LightState;

// Replace this with your username for accessing the bridge
const USERNAME = "xH8d29uzrAMxEjYQ8Lk4rMq8tli6coL3m50aRAJo"
  // The name of the light we wish to retrieve by name
  , LIGHT_ID = 23
;
function setLightState(id,onoff){
  console.log("setLightStateUsingState.js -> setLightState");
  console.log(id)
  console.log(onoff);
  if (onoff == 'true') {
    onoff = true
  }
  if (onoff == 'false') {
    onoff = false;
  }
  console.log(onoff);
   v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
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
//setLightState(24,"true");
function setLightBrightness(id,bri){
  // if (onoff == 'true') {
  //   onoff = true
  // }
  // if (onoff == 'false') {
  //   onoff = false;
  // }
  console.log("setLightStateUsingState.js -> setLightBrightness");
  console.log(id)
  console.log(bri);

   v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .then(api => {
      // Using a LightState object to build the desired state
      const state = new LightState()
      .bri(bri)    // 1 - 254
      ;
      return api.lights.setLightState(id, state);
    })
    .then(result => {
      console.log(`Light state brightness change was successful? ${result}`);
    })
  ;
}
//setLightBrightness(24,200);
function setLightHue(id,hue){
  console.log("setLightStateUsingState.js -> setLightHue");
  console.log(id)
  console.log(hue);

   v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .then(api => {
      // Using a LightState object to build the desired state
      const state = new LightState()
      .hue(hue)    // 0 - 65535
      ;
      console.log();
      return api.lights.setLightState(id, state);
    })
    .then(result => {
      console.log(`Light state HUE change was successful? ${result}`);
    })
  ;
}
// setLightHue(24,254);
function setLightSaturation(id,sat){
  console.log("setLightStateUsingState.js -> setLightSaturation");
  console.log(id)
  console.log(sat);

   v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .then(api => {
      // Using a LightState object to build the desired state
      const state = new LightState()
      .sat(sat)    // 0 - 65535
      ;
      return api.lights.setLightState(id, state);
    })
    .then(result => {
      console.log(`Light state change was successful? ${result}`);
    })
  ;
}
// setLightSaturation(24,254);
function setLightColorTemp(id,ct){
  console.log("setLightStateUsingState.js -> setLightColorTemp");
  console.log(id)
  console.log(ct);

   v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .then(api => {
      // Using a LightState object to build the desired state
      const state = new LightState()
      .ct(ct)    // 0 - 65535
      ;
      return api.lights.setLightState(id, state);
    })
    .then(result => {
      console.log(`Light state change was successful? ${result}`);
    })
  ;
}
//setLightColorTemp(24,254);

function setLight_Switch(user,id,onoff){
  // console.log("setLightStateUsingState.js -> setLight_Switch");
  // console.log(id)
  // console.log(onoff);
  console.log("this is my user name = "+user);
  if (onoff == 'true') {
    onoff = true
  }
  if (onoff == 'false') {
    onoff = false;
  }
  console.log(onoff);
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
  // console.log("setLightStateUsingState.js -> setLightState");
  // console.log(id)
  // console.log(onoff);
  console.log("this is my user name = "+user);
  if (onoff == 'true') {
    onoff = true
  }
  if (onoff == 'false') {
    onoff = false;
  }
  console.log(onoff);
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
  console.log("setLightStateUsingState.js -> setLight_Switch_Bri_Ct");
  console.log(id)
  console.log(onoff);
  if (onoff == 'true') {
    onoff = true
  }
  if (onoff == 'false') {
    onoff = false;
  }
  console.log(onoff);
   v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .then(api => {
      // Using a LightState object to build the desired state
      console.log("before LightState()");
      console.log(onoff);
      console.log(bri);
      console.log(ct);
      const state = new LightState()
      .on(onoff)
      .bri(bri)
      .ct(ct)
      ;
      console.log("before return");
      return api.lights.setLightState(id, state);
    })
    .then(result => {
      console.log(`Light state ONOFF change was successful? ${result}`);
    })
  ;
}

module.exports = {
setLightState,
setLightBrightness,
setLightHue,
setLightColorTemp,
setLight_Switch,
setLight_Switch_Bri,
setLight_Switch_Bri_Ct,
}
