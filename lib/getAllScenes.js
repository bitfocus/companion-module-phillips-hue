'use strict';

const v3 = require('node-hue-api').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

// Replace this with your username for accessing the bridge
const USERNAME  = "xH8d29uzrAMxEjYQ8Lk4rMq8tli6coL3m50aRAJo";

function getAllScenes(user){
  var myObj = {};
  return v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(user);
    })
    .then(api => {
      return api.scenes.getAll();
    })
    .then(scenes => {
      // Display all the scenes
      scenes.forEach(scene => {
        let name = scene.name;
        let id = scene.id;
        myObj[name] = id;
        //console.log(scene.toStringDetailed());
      });
    })
    .then(myReturn => {
      return JSON.parse(JSON.stringify(myObj))
    })
    .catch(err => {
      console.error(`Unexpected Error: ${err.message}`);
    })
  ;

}

module.exports = {
getAllScenes,
}
