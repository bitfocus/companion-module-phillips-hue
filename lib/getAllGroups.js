'use strict';

const v3 = require('node-hue-api').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

//const USERNAME = require('../../../test/support/testValues').username;
const USERNAME  = "xH8d29uzrAMxEjYQ8Lk4rMq8tli6coL3m50aRAJo";

function getAllRooms(user){
  let GROUPS    = [];
  var myObj = {};

  return v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(user);
    })
    .then(api => {
      return api.groups.getAll();
    })
    .then(getAllGroups => {
      // Iterate over the light objects showing details
      getAllGroups.forEach(group => {

        if(group.type == "Room"){
          let name  = group.name;
          let id    = group.id;
          myObj[name] = id;
          GROUPS.push([name,id]);
          //console.log(group.toStringDetailed());
        }
      });
    })
    .then(myReturn => {
      return JSON.parse(JSON.stringify(myObj))
    })
  ;

}
function getAllZones(user){
  let GROUPS    = [];
  var myObj = {};

  return v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(user);
    })
    .then(api => {
      return api.groups.getAll();
    })
    .then(getAllGroups => {
      // Iterate over the light objects showing details
      getAllGroups.forEach(group => {

        if(group.type == "Zone"){
          let name  = group.name;
          let id    = group.id;
          myObj[name] = id;
          GROUPS.push([name,id]);
          //console.log(group.toStringDetailed());
        }
      });
    })
    .then(myReturn => {
      return JSON.parse(JSON.stringify(myObj))
    })
  ;

}
function getAllLightGroups(user){
  let GROUPS    = [];
  var myObj = {};

  return v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(user);
    })
    .then(api => {
      return api.groups.getAll();
    })
    .then(getAllGroups => {
      // Iterate over the light objects showing details
      getAllGroups.forEach(group => {

        if(group.type == "LightGroup"){
          let name  = group.name;
          let id    = group.id;
          myObj[name] = id;
          GROUPS.push([name,id]);
          //console.log(group.toStringDetailed());
        }
      });
    })
    .then(myReturn => {
      return JSON.parse(JSON.stringify(myObj))
    })
  ;

}


module.exports = {
getAllRooms,
getAllZones,
getAllLightGroups,
}
