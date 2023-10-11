const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')

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
		this.config = config

		if (this.discoveredBridges.length === 0) {
			this.discoverBridges();
		}

		// FIXME: this does not belong here
		if (this.config.createuser && this.config.username === '') {
			this.createUser();
		}
		
		this.updateStatus(InstanceStatus.Connecting);

		if (this.config.ip && this.config.username) {
			v3.api.createLocal(this.config.ip).connect(this.config.username).then((api) => {
				// check if api is working correctly
				api.users.getUserByName(this.config.username).then(() => {

					// create local api instance and update all parameters
					this.api = api;
					this.updateParams();
				}).catch(err => {
					this.log('error', 'Unable to use API: ' + err.message);
					this.updateStatus(InstanceStatus.ConnectionFailure, 'Invalid user name')
				})
			}).catch(err => {
				this.log('error', "Unable to connect: " + err.message);
				this.updateStatus(InstanceStatus.ConnectionFailure, 'Unable to connect to bridge');
			})
		}

		this.updateActions() // export actions
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config;

		// FIXME: why is this never called?
		console.log("configUpdated");

		if (this.config.createuser) {
			this.createUser();
		}

		this.init();
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
			},
			{
				type: 'textinput',
				id: 'username',
				label: 'Bridge User',
			},
			{
				type: 'checkbox',
				label: 'Create new User',
				id: 'createuser',
				default: false,
			}
		]
	}

	async discoverBridges() {
		this.discoveredBridges = []
		v3.discovery.upnpSearch().then((results) => {
			console.log(JSON.stringify(results, null, 2));
			results.forEach((bridge) => {
				this.discoveredBridges.push(bridge)
			})
			// TODO: how to update current config field
		});
	}

	async createUser() {
		console.log("createuser");
		if (!this.config.ip) {
			return;
		}
	
		console.log("createuser2");
		const APPLICATION_NAME = 'node-hue-api', DEVICE_NAME = 'companion';
	
		v3.api.createLocal(this.config.ip).connect()
			.then(api => {
				return api.users.createUser(APPLICATION_NAME, DEVICE_NAME);
			})
			.then(createdUser => {
				console.log(createdUser);
				this.config.username = createdUser.username;
				this.config.createuser = false;
				this.saveConfig();
			})
			.catch(err => {
				if (err.getHueErrorType && err.getHueErrorType() === 101) {
					this.log('error', "You need to press the Link Button on the bridge first");
				} else {
					this.debug(`Unexpected Error: ${err}`);
					this.log('error', "Unexpected Error: " + err.message);
				}
			})
	};

	async updateParams() {
		if (!this.api) {
			return
		}
	
		this.lights = [];
		this.api.lights.getAll().then((lights) => {
			this.lights = lights;
			this.updateActions();
		});
	
		this.rooms = [];
		this.zones = [];
		this.lightGroups = [];
		this.api.groups.getAll().then((groups) => {
			groups.forEach((group) => {
				switch (group.type) {
					case 'Room':
						this.rooms.push(group);
						break;
					case 'Zone':
						this.zones.push(group);
						break;
					case 'LightGroup':
						this.lightGroups.push(group);
						break;
				}
			})
	
			this.updateActions();
		});
	
		this.scenes = [];
		this.api.scenes.getAll().then((scenes) => {
			scenes.forEach((scene) => {
				this.scenes.push(scene);
			})
	
			this.updateActions();
		});
	
		this.updateStatus(InstanceStatus.Ok);
	}

	updateActions() {
		UpdateActions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
