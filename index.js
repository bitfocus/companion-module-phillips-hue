var instance_skel 						= require('../../instance_skel');
var HUE_ALL_GROUPS						= require('./lib/getAllGroups.js');
var HUE_ALL_LAMPS							= require('./lib/getAllLights.js');
var HUE_ALL_SCENES						= require('./lib/getAllScenes.js');
var SET_LIGHT_STATE						= require('./lib/setLightStateUsingObject.js');
var SET_LIGHT_STATES					= require('./lib/setLightStateUsingState.js');
var SET_GROUPS_STATES					= require('./lib/setGroupLightState.js');
var SET_SCENES								= require('./lib/setSceneUsingID.js');
var CREATE_USER								= require('./lib/createUser.js');

var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	return self;
}

instance.GetUpgradeScripts = function() {
	// Example: When this script was committed, a fix needed to be made
	// this will only be run if you had an instance of an older "version" before.
	// "version" is calculated out from how many upgradescripts your intance config has run.
	// So just add a addUpgradeScript when you commit a breaking change to the config, that fixes
	// the config.

	return [
		function (context, config) {
			// just an example, that now cannot be removed/rewritten
			if (config) {
				if (config.host !== undefined) {
					config.old_host = config.host;
				}
			}
		}
	]
}

instance.prototype.updateConfig = function(config) {
	var self = this;
	self.updateLightList();

	self.config = config;

	if (self.config.CreateUser) {
			console.log("----------> CreateUser is Checked <----------");
			self.log('info', "----------> CreateUser is Checked <----------");
			console.log("--- Leave Username field empty to create a new user!");
			self.log('info', "--- Leave Username field empty to create a new user!");
			console.log("--- >>> Don't forget to push the button on your Huw Bridge to make the CreateUser work !");
			self.log('info', "--- >>> Don't forget to push the button on your Huw Bridge to make the CreateUser work !");
			if (0 === self.config.username.length) {
					self.CreateUser();
			}else{
				console.log("-----> Username field is NOT empty !!");
			}
	}

};
instance.prototype.init = function() {
	var self = this;

	self.status(self.STATE_OK);
	self.updateLightList();


	debug = self.debug;
	log = self.log;
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'textinput',
			id: 'username',
			label: 'Username',
			width: 8,
			value: self.users
		},
		{
			type: 'checkbox',
			label: 'CreateUser',
			id: 'CreateUser',
			default: false,
		}
	]
};
instance.prototype.updateLightList = function() {
	var self = this;
	var user = self.config.username

	HUE_ALL_LAMPS.getAllLights(user)
	.then(data => {
		self.lights = {};
		self.lights = data;
	})
	.then(data => {
			self.actions();
	})

  HUE_ALL_GROUPS.getAllRooms(user)
  .then(data => {
    self.rooms = {};
    self.rooms = data;
  })
  .then(data => {
      self.actions();
  })

  HUE_ALL_GROUPS.getAllZones(user)
  .then(data => {
    self.zones = {};
    self.zones = data;
  })
  .then(data => {
      self.actions();
  })

  HUE_ALL_GROUPS.getAllLightGroups(user)
  .then(data => {
    self.groups = {};
    self.groups = data;
  })
  .then(data => {
      self.actions();
  })

	HUE_ALL_SCENES.getAllScenes(user)
	.then(data => {
		self.scenes = {};
		self.scenes = data;

	})
	.then(data => {
			self.actions();
	})

};
instance.prototype.CreateUser = async function() {
	var self = this;
	self.users = {};
	//console.log(self.config.username);
	
	try {
		console.log("----------> CreateUser function triggerd <----------");
		var createUser = await CREATE_USER.discoverAndCreateUser()
		console.log("--- After await CreateUser")
		console.log(createUser)
		if(createUser != ""){
			self.log('info', createUser);
		}
	} catch (error) {
		console.log("----- >>> CreateUser Error <<< -----")
		self.log('info',"----- >>> CreateUser Error <<< -----");

		self.log("error",error)
		console.log(error)
	}


	// await CREATE_USER.discoverAndCreateUser().then(data => {
	// 	self.log('info', data);
	// 	self.users = data;
	// }).catch(e => {
	// 	console.log(e);
	// 	self.log("Warning",error)
	// }
	// );

};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;
	debug("destroy");
};

instance.prototype.actions = function(system) {
	var self = this;
	var s;

	self.allLightslist = [];
	if (self.lights !== undefined) {
		for (s in self.lights) {
			self.allLightslist.push({ id: s, label: s });
		}
	}

  self.allRomslist = [];
  if (self.rooms !== undefined) {
    for (s in self.rooms) {
      self.allRomslist.push({ id: s, label: s });
    }
  }

  self.allZoneslist = [];
  if (self.zones !== undefined) {
    for (s in self.zones) {
      self.allZoneslist.push({ id: s, label: s });
    }
  }

	self.allGroupslist = [];
	if (self.groups !== undefined) {
		for (s in self.groups) {
			self.allGroupslist.push({ id: s, label: s });
		}
	}

	self.allSceneslist = [];
	if (self.scenes !== undefined) {
		for (s in self.scenes) {
			self.allSceneslist.push({ id: s, label: s });
		}
	}

	self.system.emit('instance_actions', self.id, {
		'All_Scenes':{
      label: 'All_Scenes',
      options: [
        {
          type: 'dropdown',
          label: 'Scenes',
          id: 'Scenes',
          default: "Chose Scenes",
          choices: self.allSceneslist
        }
      ]
    },
    'Lamps_Switch':{
      label: 'Lamps_Switch',
      options: [
        {
          type: 'dropdown',
          label: 'Lamps',
          id: 'Lamps',
          default: "Chose Lamp",
          choices: self.allLightslist
        },
        {
          type: 'dropdown',
          label: 'ON/OFF',
          id: 'ON/OFF',
          default: true,
          choices: [ { id: true, label: 'ON' }, { id: false, label: 'OFF' } ]
        }
      ]
    },
    'Lamps_Switch_Bri':{
      label: 'Lamps_Switch_Bri',
      options: [
        {
          type: 'dropdown',
          label: 'Lamps',
          id: 'Lamps',
          default: "Chose Lamp",
          choices: self.allLightslist
        },
        {
          type: 'dropdown',
          label: 'ON/OFF',
          id: 'ON/OFF',
          default: true,
          choices: [ { id: true, label: 'ON' }, { id: false, label: 'OFF' } ]
        },
        {
          type: 'number',
          label: 'Brightness',
          tooltip: 'Sets the Brightness (1-254)',
          min: 1,
          max: 254,
          id: 'bri',
          default: 1,
          range: false
        }
      ]
    },
		'Room_Switch': {
			label: 'Room_Switch',
			options: [
				{
					type: 'dropdown',
					label: 'Rooms',
					id: 'Rooms',
					default: "Chose Rooms",
					choices: self.allRomslist
				},
				{
          type: 'dropdown',
          label: 'ON/OFF',
          id: 'ON/OFF',
          default: true,
          choices: [ { id: true, label: 'ON' }, { id: false, label: 'OFF' } ]
        }
			]
		},
		'Room_Switch_Bri':{
      label: 'Room_Switch_Bri',
      options: [
        {
          type: 'dropdown',
          label: 'Rooms',
          id: 'Rooms',
          default: "Chose Rooms",
          choices: self.allRomslist
        },
        {
          type: 'dropdown',
          label: 'ON/OFF',
          id: 'ON/OFF',
          default: true,
          choices: [ { id: true, label: 'ON' }, { id: false, label: 'OFF' } ]
        },
        {
          type: 'number',
          label: 'Brightness',
          tooltip: 'Sets the Brightness (1-254)',
          min: 1,
          max: 254,
          id: 'bri',
          default: 1,
          range: false
        }
      ]
    },
		'LightGroup_Switch': {
			label: 'LightGroup',
			options: [
				{
					type: 'dropdown',
					label: 'LightGroup',
					id: 'LightGroup',
					default: "Chose LightGroup",
					choices: self.allGroupslist
				},
				{
					type: 'dropdown',
					label: 'ON/OFF',
					id: 'ON/OFF',
					default: true,
					choices: [ { id: true, label: 'ON' }, { id: false, label: 'OFF' } ]
				}
			]
		},
		'LightGroup_Switch_Bri':{
      label: 'LightGroup_Switch_Bri',
      options: [
        {
          type: 'dropdown',
          label: 'LightGroup',
          id: 'LightGroup',
          default: "Chose LightGroup",
          choices: self.allGroupslist
        },
        {
          type: 'dropdown',
          label: 'ON/OFF',
          id: 'ON/OFF',
          default: true,
          choices: [ { id: true, label: 'ON' }, { id: false, label: 'OFF' } ]
        },
        {
          type: 'number',
          label: 'Brightness',
          tooltip: 'Sets the Brightness (1-254)',
          min: 1,
          max: 254,
          id: 'bri',
          default: 1,
          range: false
        }
      ]
    },
		'Zones_Switch': {
			label: 'Zones_Switch',
      options: [
				{
					type: 'dropdown',
					label: 'Zones',
					id: 'Zones',
					default: "Chose Zones",
					choices: self.allZoneslist
				},
				{
					type: 'dropdown',
					label: 'ON/OFF',
					id: 'ON/OFF',
					default: true,
					choices: [ { id: true, label: 'ON' }, { id: false, label: 'OFF' } ]
				}
			]
		},
		'Zones_Switch_Bri': {
			label: 'Zones_Switch_Bri',
      options: [
				{
					type: 'dropdown',
					label: 'Zones',
					id: 'Zones',
					default: "Chose Zones",
					choices: self.allZoneslist
				},
				{
					type: 'dropdown',
					label: 'ON/OFF',
					id: 'ON/OFF',
					default: true,
					choices: [ { id: true, label: 'ON' }, { id: false, label: 'OFF' } ]
				},
				{
					type: 'number',
					label: 'Brightness',
					tooltip: 'Sets the Brightness (1-254)',
					min: 1,
					max: 254,
					id: 'bri',
					default: 1,
					range: false
					//choices: [ { id: true, label: 'ON' }, { id: false, label: 'OFF' } ]
				}
			]
		}
	});
}

instance.prototype.action = function(action) {
	var self = this;
	var type;
	var preset;
	var time;
	var user = self.config.username

	debug('action: ', action);

  switch (action.action) {
		case 'All_Scenes':
			console.log("-----> All_Scenes");
			var data = self.scenes;
			// console.log(data);
			//console.log(action.options);
			var data2 = action.options.Scenes;

			for ( const [key,id] of Object.entries( data ) ) {
				if (key == data2) {
					SET_SCENES.setScene(user,id);
				}
			};


			break;
    case 'Lamps_Switch':
      console.log("-----> Lamps_Switch");
      var data = self.lights;
      // console.log(data);
      //console.log(action.options);
      var data2 = action.options.Lamps;
      var onoff = action.options["ON/OFF"];

      for ( const [key,id] of Object.entries( data ) ) {
        if (key == data2) {
          SET_LIGHT_STATES.setLight_Switch(user,id,onoff);
        }
      };


      break;
    case 'Lamps_Switch_Bri':
      console.log("-----> Lamps_Switch_Bri");
      var data = self.lights;
      // console.log(data);
      //console.log(action.options);
      var data2 = action.options.Lamps;
      var onoff = action.options["ON/OFF"];
      var bri   = action.options["bri"];

      for ( const [key,id] of Object.entries( data ) ) {
        if (key == data2) {
          SET_LIGHT_STATES.setLight_Switch_Bri(user,id,onoff,bri);
        }
      };


      break;
    case 'Room_Switch':
      console.log("-----> Room_Switch");
			var data = self.rooms;
			// console.log(data);
			// console.log(action.options);
			var data2 = action.options.Rooms;
      var onoff = action.options["ON/OFF"];

			for ( const [key,id] of Object.entries( data ) ) {
        if (key == data2) {
          SET_GROUPS_STATES.setRoom_Switch(user,id,onoff);
        }
      };

      break;
		case 'Room_Switch_Bri':
      console.log("-----> Room_Switch_Bri");
      var data = self.rooms;
      // console.log(data);
      //console.log(action.options);
      var data2 = action.options.Rooms;
      var onoff = action.options["ON/OFF"];
      var bri   = action.options["bri"];

      for ( const [key,id] of Object.entries( data ) ) {
        if (key == data2) {
					SET_GROUPS_STATES.setRoom_Switch_Bri(user,id,onoff,bri);
        }
      };


      break;
    case 'LightGroup_Switch':
      console.log("-----> LightGroup");
			var data = self.groups;
			// console.log(data);
			// console.log(action.options);
			var data2 = action.options.LightGroup;
			var onoff = action.options["ON/OFF"];

			for ( const [key,id] of Object.entries( data ) ) {
				// console.log("loop");
				// console.log(key);
				// console.log(data2);
				// console.log(key == data2);
				if (key == data2) {
					console.log("Inside");
					SET_GROUPS_STATES.setLightGroup_Switch(user,id,onoff);
				}
			};

      break;
		case 'LightGroup_Switch_Bri':
      console.log("-----> LightGroup_Switch_Bri");
      var data = self.groups;
      // console.log(data);
      // console.log(action.options);
      var data2 = action.options.LightGroup;
      var onoff = action.options["ON/OFF"];
      var bri   = action.options["bri"];

      for ( const [key,id] of Object.entries( data ) ) {
				// console.log("loop");
				// console.log(key);
				// console.log(data2);
				// console.log(key == data2);
        if (key == data2) {
					SET_GROUPS_STATES.setLightGroup_Switch_Bri(user,id,onoff,bri);
        }
      };


      break;
    case 'Zones_Switch':
      console.log("-----> Zones_Switch");
			var data = self.zones;
			// console.log(data);
			// console.log(action.options);
			var data2 = action.options.Zones;
			var onoff = action.options["ON/OFF"];

			for ( const [key,id] of Object.entries( data ) ) {
				// console.log("loop");
				// console.log(key);
				// console.log(data2);
				// console.log(key == data2);
				if (key == data2) {
					console.log("Inside");
					SET_GROUPS_STATES.setZone_Switch(user,id,onoff);
				}
			};
      break;
		case 'Zones_Switch_Bri':
      console.log("-----> Zones_Switch_Bri");
			var data = self.zones;
			// console.log(data);
      // console.log(action.options);
      var data2 = action.options.Zones;
      var onoff = action.options["ON/OFF"];
      var bri   = action.options["bri"];

      for ( const [key,id] of Object.entries( data ) ) {
				// console.log("loop");
				// console.log(key);
				// console.log(data2);
				// console.log(key == data2);
        if (key == data2) {
					SET_GROUPS_STATES.setZone_Switch_Bri(user,id,onoff,bri);
        }
      };
      break;
    }
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
