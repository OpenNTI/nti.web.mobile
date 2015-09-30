import React from 'react';

import BasePathAware from 'common/mixins/BasePath';

import Store from '../Store';

export default React.createClass({
	displayName: 'AddButton',
	mixins: [BasePathAware],

	statics : {
		canSectionBeAddedTo (section) {
			//When we have multiple paths to add content,
			//we will use this widget to direct them there.

			return Store.hasCatalog(section)	//right now, this returns true no matter what section...
				&& /course/.test(section);		// so, we need to add this extra check.
		}
	},

	propTypes: {
		section: React.PropTypes.string.isRequired
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
