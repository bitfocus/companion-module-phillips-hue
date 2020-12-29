'use strict';

const v3 = require('node-hue-api').v3;
// If using this code outside of this library the above should be replaced with
// const v3 = require('node-hue-api').v3;

// Replace this with your username for accessing the bridge
const USERNAME  = "xH8d29uzrAMxEjYQ8Lk4rMq8tli6coL3m50aRAJo";
const ID        = "5BPttvLf3ABil5Y";

function setScene(user,id){
  var myObj = {};
  v3.discovery.nupnpSearch()
    .then(searchResults => {
      const host = searchResults[0].ipaddress;
      return v3.api.createLocal(host).connect(user);
    })
    .then(api => {
      return api.scenes.activateScene(id)
    })
    .then(activated => {
      console.log(`The Scene was successfully activated? ${activated}`);
    })
    .catch(err => {
      console.error(`Unexpected Error: ${err.message}`);
    })
  ;

}

module.exports = {
setScene,
}
