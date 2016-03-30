import React from 'react';

import {rawContent} from 'common/utils/jsx';

import mixin from './mixin';

export default React.createClass( {

	displayName: 'Markup',

	propTypes: {
		element: React.PropTypes.object
	},

	mixins: [mixin],

	render () {

		const {element} = this.props;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		return (
			<div className="markup widget">
				<div {...rawContent(element.content)}/>
			</div>
		);
	}

});
