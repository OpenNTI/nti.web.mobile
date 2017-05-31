import React from 'react';

import createReactClass from 'create-react-class';

import ProfileLink from '../mixins/ProfileLink';

export default createReactClass({
	displayName: 'ProfileLink',
	mixins: [ProfileLink],

	propTypes: {
		entity: React.PropTypes.oneOfType([
			React.PropTypes.object,
			React.PropTypes.string
		])
	},

	render () {
		let {entity, ...props} = this.props;

		if (typeof entity === 'object') {
			entity = entity.getID();
		}

		props = Object.assign(props, {
			onClick: (...args) => this.navigateToProfile(entity, ...args)
		});

		return (
			<span {...props}/>
		);
	}
});
