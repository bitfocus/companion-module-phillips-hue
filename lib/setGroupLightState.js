'use strict';

const v3 = require('node-hue-api').v3;
;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

const USERNAME = "xH8d29uzrAMxEjYQ8Lk4rMq8tli6coL3m50aRAJo"
const GroupLightState = v3.lightStates.GroupLightState;

// The target Group id that we will set the light state on. Using the all groups group here as that will always be present.
const GROUP_ID = 3;

function setRoom_Switch(user,id,onoff){
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
function setRoom_Switch_Bri(user,id,onoff,bri){
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

function setLightGroup_Switch(user,id,onoff){
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
function setLightGroup_Switch_Bri(user,id,onoff,bri){
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

function setZone_Switch(user,id,onoff){
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
function setZone_Switch_Bri(user,id,onoff,bri){
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
setLightGroup_Switch,
setLightGroup_Switch_Bri,
setZone_Switch,
setZone_Switch_Bri,
}
