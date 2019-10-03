import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import ProfileLink from '../mixins/ProfileLink';

export default createReactClass({
	displayName: 'ProfileLink',
	mixins: [ProfileLink],

	propTypes: {
		entity: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.string
		])
	},

	render () {
		let {entity, ...props} = this.props;

		props = Object.assign(props, {
			onClick: (...args) => this.navigateToProfile(entity, ...args)
		});

		return (
			<span {...props}/>
		);
	}
});
