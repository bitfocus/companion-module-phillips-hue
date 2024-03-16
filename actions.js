const v3 = require('node-hue-api').v3

const state = {
    id: 'state',
    type: 'dropdown',
    label: 'State',
    default: true,
    choices: [{ id: true, label: 'On' }, { id: false, label: 'Off' }]
};

const setBrightness = {
    type: 'checkbox',
    label: 'Set Brightness?',
    id: 'setBrightness',
    default: false,
    isVisible: (config) => config.state === true
};

const brightness = {
    id: 'brightness',
    type: 'number',
    label: 'Brightness',
    tooltip: 'Sets the Brightness (1-254)',
    range: true,
    min: 1,
    max: 254,
    default: 100,
    range: true,
    isVisible: (config) => config.state === true && config.setBrightness === true,
};

module.exports = function (self) {
    self.setActionDefinitions({
        scenes: {
            name: 'Scene',
            options: [
                {
                    id: 'scene',
                    type: 'dropdown',
                    label: 'Scene',
                    default: "Select scene",
                    choices: self.scenes.map((scene) => ({
                        id: scene.id,
                        label: scene.name
                    }))
                }
            ],
            callback: async (event) => {
                if (!self.api) {
                    return;
                }

                self.api.scenes.activateScene(event.options.scene);
            },
        },
        lights: {
            name: 'Light',
            options: [
                {
                    id: 'light',
                    type: 'dropdown',
                    label: 'Light',
                    default: 'Select light',
                    choices: self.lights.map((light) => ({
                        id: light.id,
                        label: light.name
                    }))
                },
                state,
                setBrightness,
                brightness,
            ],
            callback: async (event) => {
                if (!self.api) {
                    return;
                }

                var state = new v3.lightStates.LightState().on(event.options.state);
                if (event.options.setBrightness) {
                    state.bri(event.options.brightness);
                }

                self.api.lights.setLightState(event.options.light, state).then((result) => {
                    self.checkFeedbacks('light');
                });
            },
            learn: async (action) => {
                if (!self.api || action.options.light === 'Select light') {
                    return undefined;
                }

                const light = await self.api.lights.getLight(action.options.light);

                return {
                    ...action.options,
                    state: light.state.on,
                    brightness: light.state.bri,
                }
            },
        },
        rooms: {
            name: 'Room',
            options: [
                {
                    id: 'room',
                    type: 'dropdown',
                    label: 'Room',
                    required: true,
                    default: "Select room",
                    choices: self.rooms.map((room) => ({
                        id: room.id,
                        label: room.name
                    }))
                },
                state,
                setBrightness,
                brightness,
            ],
            callback: async (event) => {
                if (!self.api) {
                    return;
                }

                var state = new v3.lightStates.GroupLightState().on(event.options.state);
                if (event.options.setBrightness) {
                    state.bri(event.options.brightness);
                }

                self.api.groups.setGroupState(event.options.room, state).then((result) => {
                    self.checkFeedbacks('room');
                });
            },
        },
        groups: {
            name: 'Group',
            options: [
                {
                    id: 'group',
                    type: 'dropdown',
                    label: 'Group',
                    required: true,
                    default: "Select group",
                    choices: self.lightGroups.map((group) => ({
                        id: group.id,
                        label: group.name
                    }))
                },
                state,
                setBrightness,
                brightness,
            ],
            callback: async (event) => {
                if (!self.api) {
                    return;
                }

                var state = new v3.lightStates.GroupLightState().on(event.options.state);
                if (event.options.setBrightness) {
                    state.bri(event.options.brightness);
                }

                self.api.groups.setGroupState(event.options.group, state).then((result) => {
                    self.checkFeedbacks('group');
                });
            },
        },
        zones: {
            name: 'Zone',
            options: [
                {
                    id: 'zone',
                    type: 'dropdown',
                    label: 'Zone',
                    required: true,
                    default: "Select zone",
                    choices: self.zones.map((zone) => ({
                        id: zone.id,
                        label: zone.name
                    }))
                },
                state,
                setBrightness,
                brightness,
            ],
            callback: async (event) => {
                if (!self.api) {
                    return;
                }

                var state = new v3.lightStates.GroupLightState().on(event.options.state);
                if (event.options.setBrightness) {
                    state.bri(event.options.brightness);
                }

                self.api.groups.setGroupState(event.options.zone, state).then((result) => {
                    self.checkFeedbacks('zone');
                });
            },
        },
    })
}
