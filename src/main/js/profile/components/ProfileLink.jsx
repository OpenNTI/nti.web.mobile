import React from 'react';

import {Link} from 'react-router-component';

import {encode} from 'common/utils/user';

import BasePathAware from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'ProfileLink',
	mixins: [BasePathAware],

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

		let id = encode(entity);

		let props = Object.assign({}, this.props, {
			//This href, you will notice, has the getBasePath... this is because
			//the router seems to not know its own root. :/ The global flag make
			//the link use the root router to generate the link, and to
			//call #navigate() ... so we have to bake in the base path.
			href: `${this.getBasePath()}profile/${id}/`,
			global: true
		});


		return (
			<Link {...props}/>
		);
	}
});
