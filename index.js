const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const { buildPresets } = require('./presets.js')
const { buildVariables } = require('./variables.js')

const v3 = require('node-hue-api').v3

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// create empty lists
		this.discoveredBridges = [];
		this.lights = [];
		this.rooms = [];
		this.zones = [];
		this.lightGroups = [];
		this.scenes = [];
	}

	async init(config) {
		this.config = config;
		this.updateStatus(InstanceStatus.Connecting);

		if (this.discoveredBridges.length === 0) {
			this.discoverBridges();
		}

		if (this.config.ip && this.config.username) {
			v3.api.createLocal(this.config.ip).connect(this.config.username).then((api) => {
				// check if api is working correctly
				api.users.getUserByName(this.config.username).then(() => {
					// create local api instance and update all parameters
					this.api = api;
					this.updateParams();

					// Ensure existing timer is cleared
					if (this.pollingTimer) {
						clearInterval(this.pollingTimer);
						delete this.pollingTimer;
					}

					this.pollingTimer = setInterval(() => {
						this.updateParams();
					}, this.config.interval);
				}).catch(err => {
					this.log('error', 'Unable to use API: ' + err.message);
					this.updateStatus(InstanceStatus.BadConfig, 'Invalid user name');
				})
			}).catch(err => {
				this.log('error', "Unable to connect: " + err.message);
				this.updateStatus(InstanceStatus.ConnectionFailure, 'Unable to connect to bridge');
			})
		}

		this.updateDefinitions();
	}

	// When module gets deleted
	async destroy() {
		if (this.api) {
			delete this.api;
		}

		if (this.pollingTimer) {
			clearInterval(this.pollingTimer);
			delete this.pollingTimer;
		}
	}

	async configUpdated(config) {
		this.config = config;

		if (this.config.createuser) {
			this.createUser();
		}

		this.init(this.config);
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'dropdown',
				id: 'ip',
				label: 'Bridge Address',
				default: '',
				allowCustom: true,
				choices: this.discoveredBridges.map((bridge) => ({
					id: bridge.ipaddress,
					label: bridge.name,
				})),
				regex: Regex.IP,
				tooltip: "Manually enter bridge IP, or select discovered bridge from the list.\nDiscovering the bridge takes some time (maybe refresh the page)..."
			},
			{
				type: 'textinput',
				id: 'username',
				label: 'Bridge User',
				tooltip: 'Enter user name, or let the "Create new user" option fill this field'
			},
			{
				type: 'checkbox',
				label: 'Create new user',
				id: 'createuser',
				default: false,
				tooltip: 'Press the sync button on your hue bridge before selecting this'
			},
			{
				type: 'number',
				label: 'Poll interval (ms)',
				id: 'interval',
				default: 500,
				min: 200,
				tooltip: 'API calls to hue bridge are limited to max 10 per second'
			}
		]
	}

	async discoverBridges() {
		this.discoveredBridges = []
		v3.discovery.upnpSearch().then((results) => {
			results.forEach((bridge) => {
				this.discoveredBridges.push(bridge);
			})
			// TODO: how to update current config field
		});
	}

	async createUser() {
		if (!this.config.ip) {
			this.updateStatus(InstanceStatus.BadConfig, "Missing bridge IP");
			return;
		}
	
		const APPLICATION_NAME = 'node-hue-api', DEVICE_NAME = 'companion';
	
		v3.api.createLocal(this.config.ip).connect()
			.then(api => {
				return api.users.createUser(APPLICATION_NAME, DEVICE_NAME);
			})
			.then(createdUser => {
				console.log('createdUser: ' + createdUser);
				this.config.username = createdUser.username;
				this.config.createuser = false;
				this.saveConfig(this.config);
				this.init(this.config);
			})
			.catch(err => {
				if (err.getHueErrorType && err.getHueErrorType() === 101) {
					this.log('error', "You need to press the Link Button on the bridge first");
					this.updateStatus(InstanceStatus.ConnectionFailure, "You need to press the Link Button on the bridge first");
				} else {
					this.log('error', "Unexpected Error: " + err.message);
					this.updateStatus(InstanceStatus.UnknownError);
				}
			})
	};

	async updateParams() {
		if (!this.api) {
			return
		}
	
		this.api.lights.getAll().then((lights) => {
			var paramsChanged = false;
			if (this.lights.length != lights.length) {
				paramsChanged = true;
			}

			// update lights
			this.lights = lights;

			// update only if something changed
			if (paramsChanged) {
				this.updateDefinitions();
			}
			
			this.checkFeedbacks('light');
		});
	
		this.api.groups.getAll().then((groups) => {
			var rooms = [];
			var zones = [];
			var lightGroups = [];

			groups.forEach((group) => {
				switch (group.type) {
					case 'Room':
						rooms.push(group);
						break;
					case 'Zone':
						zones.push(group);
						break;
					case 'LightGroup':
						lightGroups.push(group);
						break;
				}
			});

			var paramsChanged = false;
			if (this.rooms.length != rooms.length) {
				paramsChanged = true;
			}
			this.rooms = rooms;
			if (this.zones.length != zones.length) {
				paramsChanged = true;
			}
			this.zones = zones;
			if (this.lightGroups.length != lightGroups.length) {
				paramsChanged = true;
			} 
			this.lightGroups = lightGroups;
	
			// update only if something changed
			if (paramsChanged) {
				this.updateDefinitions();
			}

			this.checkFeedbacks('room');
			this.checkFeedbacks('zone');
			this.checkFeedbacks('group');
		});
	
		this.api.scenes.getAll().then((scenes) => {
			var paramsChanged = false;
			if (this.scenes.length != scenes.length) {
				paramsChanged = true;
			}
	
			// update lights
			this.scenes = scenes;

			// update only if something changed
			if (paramsChanged) {
				this.updateDefinitions();
			}
			
			this.checkFeedbacks('scene');
		});
	
		this.updateStatus(InstanceStatus.Ok);
	}

	updateDefinitions() {
		UpdateActions(this);
		UpdateFeedbacks(this);

		buildPresets(this);
		buildVariables(this);
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
