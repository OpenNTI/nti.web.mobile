import React from 'react';

import BasePathAware from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'AddButton',
	mixins: [BasePathAware],

	statics : {
		canSectionBeAddedTo (section) {
			//When we have multiple paths to add content,
			//we will use this widget to direct them there.
			//
			//For now, don't render unless the section is Course
			return /course/.test(section);
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
