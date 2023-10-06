module.exports = function (self) {
	self.setActionDefinitions({
		all_scenes: {
			name: 'All scenes',
			options: [
                {
                    type: 'dropdown',
                    label: 'Scene',
                    id: 'scene',
                    default: "Chose Scenes",
                    choices: self.scenes.map((scene) => ({
                        id: scene.id,
                        label: scene.name
                    }))
                }
			],
			callback: async (event) => {
				self.api.scenes.activateScene(event.options.scene);
			},
		},
	})
}
