import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Mixins} from 'nti-web-commons';

import Store from '../Store';

export default createReactClass({
	displayName: 'AddButton',
	mixins: [Mixins.BasePath],

	statics : {
		canSectionBeAddedTo (section) {
			//When we have multiple paths to add content,
			//we will use this widget to direct them there.

			return Store.hasCatalog(section)	//right now, this returns true no matter what section...
				&& /course/.test(section);		// so, we need to add this extra check.
		}
	},

	propTypes: {
		section: PropTypes.string.isRequired
	},

	render () {
		const {props: {section}, constructor: self} = this;

		let link = (this.getBasePath() + '/catalog/').replace(/\/\//g, '/');

		if (!self.canSectionBeAddedTo(section)) {
			return null;
		}

		return (
			<a href={link} className="button library-add">Add</a>
		);
	}
});
