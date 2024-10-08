module.exports = [
	function (context, config) {
		// just an example, that now cannot be removed/rewritten
		if (config) {
			if (config.host !== undefined) {
				config.old_host = config.host;
			}
		}
	},

	function v1_0_0(context, props) {
		const result = {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}

		if (props.config && props.config.interval === undefined) {
			props.config.interval = 500;
			result.updatedConfig = props.config;
		}

		let upgradeAction = (action) => {
			if (action.options === undefined) {
				return;
			}

			if (action.options.bri !== undefined) {
				action.options.brightness = action.options.bri;
				action.options.setBrightness = true;
				delete action.options.bri;
			}

			if (action.options['ON/OFF'] !== undefined) {
				action.options.state = action.options['ON/OFF'] ? 'on' : 'off';
				delete action.options['ON/OFF'];
			}

			switch (action.actionId) {
				case 'All_Scenes':
					if (action.options['Scenes'] !== undefined) {
						action.options.scene = action.options['Scenes'];
						delete action.options['Scenes'];
					}

					action.actionId = 'scene';
					break;

				case 'Lamps_Switch_Bri':
				case 'Lamps_Switch':
					if (action.options['Lamps'] !== undefined) {
						action.options.light = action.options['Lamps'];
						delete action.options['Lamps'];
					}

					action.actionId = 'light';
					break;

				case 'Room_Switch_Bri':
				case 'Room_Switch':
					if (action.options['Rooms'] !== undefined) {
						action.options.room = action.options['Rooms'];
						delete action.options['Rooms'];
					}

					action.actionId = 'room';
					break;

				case 'LightGroup_Switch_Bri':
				case 'LightGroup_Switch':
					if (action.options['LightGroup'] !== undefined) {
						action.options.group = action.options['LightGroup'];
						delete action.options['LightGroup'];
					}

					action.actionId = 'group';
					break;

				case 'Zones_Switch':
				case 'Zones_Switch_Bri':
					if (action.options['Zones'] !== undefined) {
						action.options.zone = action.options['Zones'];
						delete action.options['Zones'];
					}

					action.actionId = 'zone';
					break;
			}

			result.updatedActions.push(action);
		}

		if (props.actions) {
			for (let k in props.actions) {
				upgradeAction(props.actions[k]);
			}
		}

		return result;
	},
]
