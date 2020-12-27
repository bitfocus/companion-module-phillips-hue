'use strict';

const v3 = require('node-hue-api').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

//const USERNAME = require('../../../test/support/testValues').username;
const USERNAME  = "xH8d29uzrAMxEjYQ8Lk4rMq8tli6coL3m50aRAJo";


function getAllLights(user){
  let LIGHTS    = [];
  var myObj = {};

  return v3.discovery.nupnpSearch()
      .then(searchResults => {
        const host = searchResults[0].ipaddress;
        return v3.api.createLocal(host).connect(USERNAME);
      })
      .then(api => {
        return api.lights.getAll();
      })
      .then(allLights => {
        allLights.forEach(light => {
          let name  = light.name;
          let id    = light.id;
          myObj[name] = id;

          //LIGHTS.push(obj);
          LIGHTS.push([name,id]);
        });
      })
      .then(myReturn => {
        //console.log(LIGHTS);
        //console.log(JSON.stringify(LIGHTS,null,4));
        // console.log(myObj);
        // console.log(JSON.stringify(myObj));
        // console.log(JSON.parse(JSON.stringify(myObj)));


        return JSON.parse(JSON.stringify(myObj))
      })
      .catch(err => {
        console.error(err);
      })
    ;
}
module.exports = {
getAllLights,
}
