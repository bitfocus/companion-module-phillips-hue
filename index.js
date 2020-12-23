var instance_skel 						= require('../../instance_skel');
var HUE_ALL_GROUPS						= require('./lib/getAllGroups.js');
var HUE_ALL_LAMPS							= require('./lib/getAllLights.js');
var SET_LIGHT_STATE						= require('./lib/setLightStateUsingObject.js');
var SET_LIGHT_STATES					= require('./lib/setLightStateUsingState.js');

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
			//regex: self.REGEX_IP
			regex: self.REGEX_USERNAME
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
		// 'Lamps': {
		// 	label: 'Lamps',
		// 	options: [
		// 		{
		// 			type: 'dropdown',
		// 			label: 'Lamps',
		// 			id: 'Lamps',
		// 			default: "Chose Lamp",
		// 			choices: self.allLightslist
		// 		},
    //     {
    //       type: 'checkbox',
    //       label: 'ON/OFF bool',
    //       id: 'ON/OFF_bool',
    //       default: true
    //     },
    //     {
		// 			type: 'dropdown',
		// 			label: 'ON/OFF',
		// 			id: 'ON/OFF',
		// 			default: true,
    //       choices: [ { id: true, label: 'ON' }, { id: false, label: 'OFF' } ]
		// 		},
    //     {
    //       type: 'checkbox',
    //       label: 'Brightness Bool',
    //       id: 'bri_bool',
    //       default: true
    //     },
    //     {
    //       type: 'number',
    //       label: 'Brightness',
    //       tooltip: 'Sets the Brightness (1-254)',
    //       min: 1,
    //       max: 254,
    //       id: 'bri',
    //       default: 1,
    //       range: false
    //       //choices: [ { id: true, label: 'ON' }, { id: false, label: 'OFF' } ]
    //     },
    //     {
    //       type: 'checkbox',
    //       label: 'Hue Bool',
    //       id: 'hue_bool',
    //       default: true
    //     },
    //     {
    //       type: 'number',
    //       label: 'Hue',
    //       tooltip: 'Sets the hue (0 - 65535)',
    //       min: 0,
    //       max: 65535,
    //       id: 'hue',
    //       default: 0,
    //       range: false
    //       //choices: [ { id: true, label: 'ON' }, { id: false, label: 'OFF' } ]
    //     },
    //     {
    //       type: 'checkbox',
    //       label: 'Saturation Bool',
    //       id: 'sat_bool',
    //       default: true
    //     },
    //     {
    //       type: 'number',
    //       label: 'Saturation',
    //       tooltip: 'Sets the saturation (0 - 254)',
    //       min: 0,
    //       max: 254,
    //       id: 'sat',
    //       default: 0,
    //       range: false
    //       //choices: [ { id: true, label: 'ON' }, { id: false, label: 'OFF' } ]
    //     },
    //     {
    //       type: 'checkbox',
    //       label: 'Color temperature Bool',
    //       id: 'ct_bool',
    //       default: true
    //     },
    //     {
    //       type: 'number',
    //       label: 'Color temperature',
    //       tooltip: 'Sets the color temperature (53 - 500)',
    //       min: 53,
    //       max: 500,
    //       id: 'ct',
    //       default: 200,
    //       //choices: [ { id: true, label: 'ON' }, { id: false, label: 'OFF' } ]
    //     }
    //   ]
		// },
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
    // 'Lamps_Switch_Bri_Ct':{
    //   label: 'Lamps_Switch_Bri_Ct',
    //   options: [
    //     {
    //       type: 'dropdown',
    //       label: 'Lamps',
    //       id: 'Lamps',
    //       default: "Chose Lamp",
    //       choices: self.allLightslist
    //     },
    //     {
    //       type: 'dropdown',
    //       label: 'ON/OFF',
    //       id: 'ON/OFF',
    //       default: true,
    //       choices: [ { id: true, label: 'ON' }, { id: false, label: 'OFF' } ]
    //     },
    //     {
    //       type: 'number',
    //       label: 'Brightness',
    //       tooltip: 'Sets the Brightness (1-254)',
    //       min: 1,
    //       max: 254,
    //       id: 'bri',
    //       default: 1,
    //       range: false
    //       //choices: [ { id: true, label: 'ON' }, { id: false, label: 'OFF' } ]
    //     },
    //     {
    //       type: 'number',
    //       label: 'Color temperature',
    //       tooltip: 'Sets the color temperature (53 - 500)',
    //       min: 53,
    //       max: 500,
    //       id: 'ct',
    //       default: 200,
    //       //choices: [ { id: true, label: 'ON' }, { id: false, label: 'OFF' } ]
    //     }
    //   ]
    // },
		'Rooms': {
			label: 'Rooms',
			options: [
				{
					type: 'dropdown',
					label: 'Rooms',
					id: 'Rooms',
					default: "Chose Rooms",
					choices: self.allRomslist
				}]
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

	debug('action: ', action);

  switch (action.action) {
    // case 'Lamps':
    //   console.log("-----> Lamps");
    //   var data = self.lights;
    //   console.log(data);
    //   var data2 = action.options.Lamps;
    //   var onoff_bool = action.options["ON/OFF_bool"];
    //   var onoff = action.options["ON/OFF"];
    //
    //   var bri_bool = action.options["bri_bool"];
    //   var bri = action.options["bri"];
    //
    //   var hue_bool = action.options["hue_bool"];
    //   var hue = action.options["hue"];
    //
    //   var sat_bool = action.options["sat_bool"];
    //   var sat = action.options["sat"];
    //
    //   var ct_bool = action.options["ct_bool"];
    //   var ct = action.options["ct"];
    //   //console.log(action.options);
    //
    //   for ( const [key,id] of Object.entries( data ) ) {
    //     //console.log("loop");
    //     // console.log(key);
    //     // console.log(data2);
    //     if (key == data2) {
    //       console.log(key);
    //       console.log(data2);
    //       console.log(id);
    //       console.log(onoff);
    //       console.log("I'm Sending to setLightState!");
    //       // SET_LIGHT_STATES.setLightState(id,onoff);
    //       // SET_LIGHT_STATES.setLightBrightness(id,bri);
    //       // SET_LIGHT_STATES.setLightHue(id,hue);
    //       // SET_LIGHT_STATES.setLightSaturation(id,sat);
    //       // SET_LIGHT_STATES.setLightColorTemp(id,ct);
    //
    //       //SET_LIGHT_STATES.setLightStateAll(id,onoff_bool,onoff,bri_bool,bri,hue_bool,hue,sat_bool,sat,ct_bool,ct);
    //
    //
    //
    //
    //     }
    //   };
    //
    //
    //   break;
    case 'Lamps_Switch':
      console.log("-----> Lamps_Switch");
      var data = self.lights;
      console.log(data);
      //console.log(action.options);
      var data2 = action.options.Lamps;
      var onoff = action.options["ON/OFF"];

      for ( const [key,id] of Object.entries( data ) ) {
        if (key == data2) {
          SET_LIGHT_STATES.setLight_Switch(id,onoff);
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
          SET_LIGHT_STATES.setLight_Switch_Bri(id,onoff,bri);
        }
      };


      break;
    // case 'Lamps_Switch_Bri_Ct':
    //   console.log("-----> setLight_Switch_Bri_Ct");
    //   var data = self.lights;
    //   console.log(data);
    //   var data2 = action.options.Lamps;
    //   var onoff = action.options["ON/OFF"];
    //   var bri   = action.options["bri"];
    //   var ct    = action.options["ct"];
    //   //console.log(action.options);
    //
    //   for ( const [key,id] of Object.entries( data ) ) {
    //     if (key == data2) {
    //       console.log("MATCH FOUND");
    //       SET_LIGHT_STATES.setLight_Switch_Bri_Ct(id,onoff,bri,ct);
    //     }
    //   };
    //
    //
    //   break;
    case 'Rooms':
      console.log("-----> Rooms");
      break;
    case 'LightGroup':
      console.log("-----> LightGroup");
      break;
    case 'Zones':
      console.log("-----> Zones");
      break;
    }
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
