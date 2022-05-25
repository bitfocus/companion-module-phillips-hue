var instance_skel = require('../../instance_skel');

const v3 = require('node-hue-api').v3

var debug;
var log;

function instance(system, id, config) {
    var self = this;

    // super-constructor
    instance_skel.apply(this, arguments);

    // create empty lists
    self.discoveredBridges = [];
    self.lights = [];
    self.rooms = [];
    self.zones = [];
    self.lightGroups = [];
    self.scenes = [];

    self.actions(); // export actions

    return self;
}

instance.GetUpgradeScripts = function () {
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

instance.prototype.updateConfig = function (config) {
    var self = this;

    self.config = config;
    self.init();
};

instance.prototype.init = function () {
    var self = this;

    if (self.discoveredBridges.length === 0) {
        self.discoverBridges();
    }

    self.status(self.STATUS_WARNING, 'Syncing');

    if (self.config.ip && self.config.username) {
        v3.api.createLocal(self.config.ip).connect(self.config.username).then((api) => {
            // create local api instance and update all parameters
            self.api = api;
            self.updateParams();
        })
    }

    debug = self.debug;
    log = self.log;
};

instance.prototype.discoverBridges = function () {
    var self = this;

    self.discoveredBridges = []
    v3.discovery.upnpSearch().then((results) => {
        console.log(JSON.stringify(results, null, 2));
        results.forEach((bridge) => {
            self.discoveredBridges.push(bridge)
        })
    });
}

instance.prototype.updateParams = function () {
    var self = this

    if (!self.api) {
        return
    }

    self.lights = [];
    self.api.lights.getAll().then((lights) => {
        self.lights = lights;
        self.actions();
    });

    self.rooms = [];
    self.zones = [];
    self.lightGroups = [];
    self.api.groups.getAll().then((groups) => {
        groups.forEach((group) => {
            switch (group.type) {
                case 'Room':
                    self.rooms.push(group);
                    break;
                case 'Zone':
                    self.zones.push(group);
                    break;
                case 'LightGroup':
                    self.lightGroups.push(group);
                    break;
            }
        })

        self.actions();
    });

    self.scenes = [];
    self.api.scenes.getAll().then((scenes) => {
        scenes.forEach((scene) => {
            self.scenes.push(scene);
        })

        self.actions();
    });

    self.status(self.STATUS_OK);
}

// Return config fields for web config
instance.prototype.config_fields = function () {
    var self = this

    return [
        {
            type: 'dropdown',
            id: 'ip',
            label: 'Bridge Address',
            width: 5,
            default: '',
            allowCustom: true,
            choices: self.discoveredBridges.map((bridge) => ({
                id: bridge.ipaddress,
                label: bridge.name,
            })),
            regex: self.REGEX_IP,
        },
        {
            type: 'textinput',
            id: 'username',
            label: 'Bridge User',
            width: 10,
            required: true,
        }
    ]
}

// When module gets deleted
instance.prototype.destroy = function () {
    var self = this;
    debug("destroy");
};

instance.prototype.actions = function (system) {
    var self = this;

    self.system.emit('instance_actions', self.id, {
        'All_Scenes': {
            label: 'All_Scenes',
            options: [
                {
                    type: 'dropdown',
                    label: 'Scenes',
                    id: 'Scenes',
                    default: "Chose Scenes",
                    choices: self.scenes.map((scene) => ({
                        id: scene.id,
                        label: scene.name
                    }))
                }
            ]
        },
        'Lamps_Switch': {
            label: 'Lamps_Switch',
            options: [
                {
                    type: 'dropdown',
                    label: 'Lamps',
                    id: 'Lamps',
                    default: "Chose Lamp",
                    choices: self.lights.map((light) => ({
                        id: light.id,
                        label: light.name
                    }))
                },
                {
                    type: 'dropdown',
                    label: 'ON/OFF',
                    id: 'ON/OFF',
                    default: true,
                    choices: [{id: true, label: 'ON'}, {id: false, label: 'OFF'}]
                }
            ]
        },
        'Lamps_Switch_Bri': {
            label: 'Lamps_Switch_Bri',
            options: [
                {
                    type: 'dropdown',
                    label: 'Lamps',
                    id: 'Lamps',
                    default: "Chose Lamp",
                    choices: self.lights.map((light) => ({
                        id: light.id,
                        label: light.name
                    }))
                },
                {
                    type: 'dropdown',
                    label: 'ON/OFF',
                    id: 'ON/OFF',
                    default: true,
                    choices: [{id: true, label: 'ON'}, {id: false, label: 'OFF'}]
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
                    choices: self.rooms.map((room) => ({
                        id: room.id,
                        label: room.name
                    }))
                },
                {
                    type: 'dropdown',
                    label: 'ON/OFF',
                    id: 'ON/OFF',
                    default: true,
                    choices: [{id: true, label: 'ON'}, {id: false, label: 'OFF'}]
                }
            ]
        },
        'Room_Switch_Bri': {
            label: 'Room_Switch_Bri',
            options: [
                {
                    type: 'dropdown',
                    label: 'Rooms',
                    id: 'Rooms',
                    default: "Chose Rooms",
                    choices: self.rooms.map((room) => ({
                        id: room.id,
                        label: room.name
                    }))
                },
                {
                    type: 'dropdown',
                    label: 'ON/OFF',
                    id: 'ON/OFF',
                    default: true,
                    choices: [{id: true, label: 'ON'}, {id: false, label: 'OFF'}]
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
                    choices: self.lightGroups.map((group) => ({
                        id: group.id,
                        label: group.name
                    }))
                },
                {
                    type: 'dropdown',
                    label: 'ON/OFF',
                    id: 'ON/OFF',
                    default: true,
                    choices: [{id: true, label: 'ON'}, {id: false, label: 'OFF'}]
                }
            ]
        },
        'LightGroup_Switch_Bri': {
            label: 'LightGroup_Switch_Bri',
            options: [
                {
                    type: 'dropdown',
                    label: 'LightGroup',
                    id: 'LightGroup',
                    default: "Chose LightGroup",
                    choices: self.lightGroups.map((group) => ({
                        id: group.id,
                        label: group.name
                    }))
                },
                {
                    type: 'dropdown',
                    label: 'ON/OFF',
                    id: 'ON/OFF',
                    default: true,
                    choices: [{id: true, label: 'ON'}, {id: false, label: 'OFF'}]
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
                    choices: self.zones.map((zone) => ({
                        id: zone.id,
                        label: zone.name
                    }))
                },
                {
                    type: 'dropdown',
                    label: 'ON/OFF',
                    id: 'ON/OFF',
                    default: true,
                    choices: [{id: true, label: 'ON'}, {id: false, label: 'OFF'}]
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
                    choices: self.zones.map((zone) => ({
                        id: zone.id,
                        label: zone.name
                    }))
                },
                {
                    type: 'dropdown',
                    label: 'ON/OFF',
                    id: 'ON/OFF',
                    default: true,
                    choices: [{id: true, label: 'ON'}, {id: false, label: 'OFF'}]
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

instance.prototype.action = function (action) {
    var self = this;

    if (!self.api) {
        return;
    }

    switch (action.action) {
        case 'All_Scenes':
            self.api.scenes.activateScene(action.options.Scenes);
            break;
        case 'Lamps_Switch':
            self.api.lights.setLightState(action.options.Lamps, new v3.lightStates.LightState().on(action.options['ON/OFF']));
            break;
        case 'Lamps_Switch_Bri':
            self.api.lights.setLightState(action.options.Lamps,
                new v3.lightStates.LightState().on(action.options['ON/OFF']).bri(action.options["bri"]));
            break;
        case 'Room_Switch':
            self.api.groups.setGroupState(action.options.Rooms, new v3.lightStates.GroupLightState().on(action.options['ON/OFF']));
            break;
        case 'Room_Switch_Bri':
            self.api.groups.setGroupState(action.options.Rooms,
                new v3.lightStates.GroupLightState().on(action.options['ON/OFF']).bri(action.options["bri"]));
            break;
        case 'LightGroup_Switch':
            self.api.groups.setGroupState(action.options.LightGroup, new v3.lightStates.GroupLightState().on(action.options['ON/OFF']));
            break;
        case 'LightGroup_Switch_Bri':
            self.api.groups.setGroupState(action.options.LightGroup,
                new v3.lightStates.GroupLightState().on(action.options['ON/OFF']).bri(action.options["bri"]));
            break;
        case 'Zones_Switch':
            self.api.groups.setGroupState(action.options.Zones, new v3.lightStates.GroupLightState().on(action.options['ON/OFF']));
            break;
        case 'Zones_Switch_Bri':
            self.api.groups.setGroupState(action.options.Zones,
                new v3.lightStates.GroupLightState().on(action.options['ON/OFF']).bri(action.options["bri"]));
            break;
    }
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
