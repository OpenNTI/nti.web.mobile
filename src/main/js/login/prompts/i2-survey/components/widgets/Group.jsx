import React from 'react';

import mixin from './mixin';
import widget from './';

export default React.createClass({

	propTypes: {
		element: React.PropTypes.object.isRequired
	},

	mixins: [mixin],

	render () {
		const {element} = this.props;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		return (
			<div className="group">
			{element.elements.map((e, i) => {
				const Widget = widget(e.type);
				return <div key={i}><Widget element={e} requirement={e.requirement} /></div>;
			})}
			</div>
		);
	}
});
