import React from 'react';

import BasePathAware from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'AddButton',
	mixins: [BasePathAware],

	propTypes: {
		section: React.PropTypes.string.isRequired
	},

	render () {
		const {props: {section}} = this;

		let link = (this.getBasePath() + '/catalog/').replace(/\/\//g, '/');

		//When we have multiple paths to add content,
		//we will use this widget to direct them there.
		//
		//For now, don't render unless the section is Course
		if (!/course/.test(section)) {
			return null;
		}

		return (
			<a href={link} className="button add">Add</a>
		);
	}
});
