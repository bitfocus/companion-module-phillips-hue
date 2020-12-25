var instance_skel 						= require('../../instance_skel');
var HUE_ALL_GROUPS						= require('./lib/getAllGroups.js');
var HUE_ALL_LAMPS							= require('./lib/getAllLights.js');
var SET_LIGHT_STATE						= require('./lib/setLightStateUsingObject.js');
var SET_LIGHT_STATES					= require('./lib/setLightStateUsingState.js');
var SET_GROUPS_STATES					= require('./lib/setGroupLightState.js');
var CREATE_USER								= require('./lib/createUser.js');

var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	// Example: When this script was committed, a fix needed to be made
	// this will only be run if you had an instance of an older "version" before.
	// "version" is calculated out from how many upgradescripts your intance config has run.
	// So just add a addUpgradeScript when you commit a breaking change to the config, that fixes
	// the config.

	self.addUpgradeScript(function () {
		// just an example
		if (self.config.host !== undefined) {
			self.config.old_host = self.config.host;
		}
	});

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;
	self.config = config;
	console.log("----------when is this pushed");
	console.log(self.config.CreateUser);
	console.log(self.config.CreateUser = true);
	console.log(self.config.CreateUser == true);

	console.log(self.config.CreateUser === true);
	if (self.config.CreateUser === true) {
			console.log("---------- CreateUser === true");


			if (0 === self.config.username.length) {
				console.log("STRING IS 0 LEGNTH");
					self.CreateUser();
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
			//regex: self.REGEX_IP
			//regex: self.REGEX_USERNAME
		},
		{
			type: 'dropdown',
			label: 'CreateUser',
			id: 'CreateUser',
			default: "true",
			choices: [
				{ id: null, label: 'Select CreateUser To Create A User' },
				{ id: true, label: 'CreateUser' }
			]
		}
	]
};
instance.prototype.updateLightList = function() {
	var self = this;

	HUE_ALL_LAMPS.getAllLights()
	.then(data => {
		self.lights = {};
		self.lights = data;
	})
	.then(data => {
			self.actions();
	})

  HUE_ALL_GROUPS.getAllRooms()
  .then(data => {
    self.rooms = {};
    self.rooms = data;
  })
  .then(data => {
      self.actions();
  })

  HUE_ALL_GROUPS.getAllZones()
  .then(data => {
    self.zones = {};
    self.zones = data;
  })
  .then(data => {
      self.actions();
  })

  HUE_ALL_GROUPS.getAllLightGroups()
  .then(data => {
    self.groups = {};
    self.groups = data;
  })
  .then(data => {
      self.actions();
  })

};
instance.prototype.CreateUser = function() {
	var self = this;
	self.users = {};
	console.log("CreateUser function triggerd");
	//console.log(self.REGEX_USERNAME);
	console.log(self.config.username);
	self.log('warn', 'you data/message');
	self.log('info', self.config.CreateUser);
	self.log('debug', 'you data/message');
	//self.log('info', CREATE_USER.discoverAndCreateUser());

	CREATE_USER.discoverAndCreateUser().then(data => {
		self.log('info', data);
		self.users = data;
	});



	// console.log("users before config = "+self.users);
	// self.users = self.config.username
	// console.log("users after config = "+self.users);
	//
	// console.log("CreateUser is triggerd");
	// console.log(self.config);


	//CREATE_USER.discoverAndCreateUser();
	//self.REGEX_USERNAME

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

	self.system.emit('instance_actions', self.id, {
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
          //choices: [ { id: true, label: 'ON' }, { id: false, label: 'OFF' } ]
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
		'LightGroup': {
			label: 'LightGroup',
			options: [
				{
					type: 'dropdown',
					label: 'LightGroup',
					id: 'LightGroup',
					default: "Chose LightGroup",
					choices: self.allGroupslist
				}]
		},
		'Zones': {
			label: 'Zones',
      options: [
				{
					type: 'dropdown',
					label: 'Zones',
					id: 'Zones',
					default: "Chose Zones",
					choices: self.allZoneslist
				}]
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
    case 'Lamps_Switch':
      console.log("-----> Lamps_Switch");
      var data = self.lights;
      console.log(data);
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
      console.log(data);
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
			console.log(data);
			console.log(action.options);
			var data2 = action.options.Rooms;
      var onoff = action.options["ON/OFF"];

			for ( const [key,id] of Object.entries( data ) ) {
        if (key == data2) {
          SET_GROUPS_STATES.setRoom_Switch(user,id,onoff);
        }
      };

      break;
    case 'LightGroup':
      console.log("-----> LightGroup");
			var data = self.groups;
			console.log(data);
      break;
    case 'Zones':
      console.log("-----> Zones");
			var data = self.zones;
			console.log(data);
      break;
    }
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
