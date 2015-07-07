import React from 'react';

import {Link} from 'react-router-component';

import {encode} from 'common/utils/user';

import BasePathAware from 'common/mixins/BasePath';


export function makeHref (id) {
	id = id && id.getID ? id.getID() : id;
	return (`profile/${encode(id)}/`).replace(/\/\//g, '/');
}

export default React.createClass({
	displayName: 'ProfileLink',
	mixins: [BasePathAware],

	statics: {
		makeHref
	},

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
			//This href, you will notice, has the getBasePath... this is because
			//the router seems to not know its own root. :/ The global flag make
			//the link use the root router to generate the link, and to
			//call #navigate() ... so we have to bake in the base path.
			href: `${this.getBasePath()}${makeHref(entity)}`,
			global: true
		});


		return (
			<Link {...props}/>
		);
	}
});
