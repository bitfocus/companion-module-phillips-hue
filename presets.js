const { combineRgb } = require('@companion-module/base')

function buildPresets(self) {
    const presets = {}

    self.lights.forEach((light) => {
        presets[`light_${light.id}`] = {
            type: 'button',
            category: 'Light',
            name: light.name,
            style: {
                text: `$(hue:light_${light.id})`,
                size: 'auto',
                color: combineRgb(255, 255, 255),
                bgcolor: combineRgb(0, 0, 0),
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'light',
                            options: {
                                light: light.id,
                                state: true,
                            },
                        },
                    ],
                    up: [],
                },
            ],
            feedbacks: [{
                feedbackId: 'light',
                options: {
                    light: light.id,
                },
                style: {
                    bgcolor: combineRgb(0, 255, 0),
                    color: combineRgb(0, 0, 0),
                },
            }]
        }
    });

    self.rooms.forEach((room) => {
        presets[`room_${room.id}`] = {
            type: 'button',
            category: 'Room',
            name: room.name,
            style: {
                text: `$(hue:room_${room.id})`,
                size: 'auto',
                color: combineRgb(255, 255, 255),
                bgcolor: combineRgb(0, 0, 0),
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'room',
                            options: {
                                room: room.id,
                                state: true,
                            },
                        },
                    ],
                    up: [],
                },
            ],
            feedbacks: [{
                feedbackId: 'room',
                options: {
                    room: room.id,
                },
                style: {
                    bgcolor: combineRgb(0, 255, 0),
                    color: combineRgb(0, 0, 0),
                },
            }]
        }
    });

    self.setPresetDefinitions(presets)
}

module.exports = { buildPresets }