import React from 'react';

import ProfileLink from '../mixins/ProfileLink';

export default React.createClass({
	displayName: 'ProfileLink',
	mixins: [ProfileLink],

	propTypes: {
		entity: React.PropTypes.oneOfType([
			React.PropTypes.object,
			React.PropTypes.string
		])
	},

	render () {
		let {entity} = this.props;

		if (typeof entity === 'object') {
			entity = entity.getID();
		}

		let props = Object.assign({}, this.props, {
			onClick: this.navigateToProfile.bind(this, entity)
		});

		return (
			<span {...props}/>
		);
	}
});
