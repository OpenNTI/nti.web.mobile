import React from 'react';

import DisplayName from './DisplayName';

const KEY = 'defaultValue';

export default React.createClass({
	displayName: 'ShareWith',

	propTypes: {
		defaultValue: React.PropTypes.array,

		scope: React.PropTypes.object
	},


	getInitialState () {
		return {};
	},


	componentWillMount () {
		this.setup();
	},


	componentWillReceiveProps (nextProps) {
		if (nextProps[KEY] !== this.props[KEY]) {
			this.setup(nextProps);
		}
	},


	setup (props = this.props) {
		const stillValid = () => props[KEY] === this.props[KEY];

		this.setState({value: props.defaultValue});

		props.scope.getSharingSuggestions()
			.then(suggestions => {
				if (stillValid()) {
					this.setState({suggestions});
				}
			});
	},


	render () {
		let {value = []} = this.state;
		return (
			<div>
				{value.map(e => (<DisplayName key={e} entity={e}/>))}
			</div>
		);
	}
});
