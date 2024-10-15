const v3 = require('node-hue-api').v3

const state = {
    id: 'state',
    type: 'dropdown',
    label: 'State',
    default: 'on',
    choices: [{ id: 'on', label: 'On' }, { id: 'off', label: 'Off' }, { id: 'toggle', label: 'Toggle' }]
};

const setBrightness = {
    type: 'checkbox',
    label: 'Set Brightness?',
    id: 'setBrightness',
    default: false,
    isVisible: (config) => config.state === 'on'
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
    isVisible: (config) => config.state === 'on' && config.setBrightness === true,
};

function getLightState(elements, options, type) {
    switch (options.state) {
        case 'on':
            return true;
        case 'off':
            return false;
        case 'toggle':
            const element = elements.find((element) => element.id == options[type]);
            if (element) {
                if ('on' in element.state) {
                    return !element.state.on;
                }
                else if ('any_on' in element.state) {
                    return !element.state.any_on;
                }
            }
    }

    return false;
}

module.exports = function (self) {
    self.setActionDefinitions({
        scene: {
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
        light: {
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

                var lightState = new v3.lightStates.LightState().on(getLightState(self.lights, event.options, 'light'));
                if (event.options.setBrightness) {
                    lightState.bri(event.options.brightness);
                }

                self.api.lights.setLightState(event.options.light, lightState).then((result) => {
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
                    state: light.state.on ? 'on' : 'off',
                    brightness: light.state.bri,
                }
            },
        },
        room: {
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

                var lightState = new v3.lightStates.GroupLightState().on(getLightState(self.rooms, event.options, 'room'));
                if (event.options.setBrightness) {
                    lightState.bri(event.options.brightness);
                }

                self.api.groups.setGroupState(event.options.room, lightState).then((result) => {
                    self.checkFeedbacks('room');
                });
            },
        },
        group: {
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

                var lightState = new v3.lightStates.GroupLightState().on(getLightState(self.groups, event.options));
                if (event.options.setBrightness) {
                    lightState.bri(event.options.brightness);
                }

                self.api.groups.setGroupState(event.options.group, lightState).then((result) => {
                    self.checkFeedbacks('group');
                });
            },
        },
        zone: {
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

                var lightState = new v3.lightStates.GroupLightState().on(getLightState(self.zones, event.options));
                if (event.options.setBrightness) {
                    lightState.bri(event.options.brightness);
                }

                self.api.groups.setGroupState(event.options.zone, lightState).then((result) => {
                    self.checkFeedbacks('zone');
                });
            },
        },
    })
}
