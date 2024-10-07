module.exports = [
	function v1_0_0(context, props) {
		const result = {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}

		if (props.config && props.config.interval === undefined) {
			props.config.interval = 500;
			result.updatedConfig = props.config
		}

		return result
	},
]
