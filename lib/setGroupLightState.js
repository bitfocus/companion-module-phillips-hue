'use strict';

const v3 = require('node-hue-api').v3;
;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const USERNAME = "xH8d29uzrAMxEjYQ8Lk4rMq8tli6coL3m50aRAJo"
const GroupLightState = v3.lightStates.GroupLightState;

// The target Group id that we will set the light state on. Using the all groups group here as that will always be present.
const GROUP_ID = 3;

function setLightState(ID,STATE){
  return v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .then(api => {
      // Build a desired light state for the group
      const groupState = new GroupLightState()
        .on()
        .brightness(20)
        .saturation(50)
      ;

      return api.groups.setGroupState(GROUP_ID, groupState);
    })
    .then(result => {
      console.log(`Successfully set group light state? ${result}`);
    })
    .catch(err => {
      console.error(err);
    })
  ;
}

function setRoom_Switch(user,id,onoff){
  console.log("setGroupLightState.js -> setRoom_Switch");
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
      return v3.api.createLocal(host).connect(USERNAME);
    })
    .then(api => {
      // Build a desired light state for the group
      const groupState = new GroupLightState()
        .on(onoff)
      ;

      return api.groups.setGroupState(id, groupState);
    })
    .then(result => {
      console.log(`Room state ONOFF change was successful? ${result}`);
    })
  ;
}
//setRoom_Switch(3,'false');
function setRoom_Switch_Bri(user,id,onoff,bri){
  console.log("setGroupLightState.js -> setRoom_Switch_Bri");
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
      // Using a RoomState object to build the desired state
      const groupState = new GroupLightState()
      .on(onoff)
      .bri(bri)
      ;
      return api.groups.setGroupState(id, groupState);
    })
    .then(result => {
      console.log(`Room state ONOFF change was successful? ${result}`);
    })
  ;
}

module.exports = {
setRoom_Switch,
setRoom_Switch_Bri,
}
