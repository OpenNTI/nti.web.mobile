import React from 'react';

import Checkbox from './Checkbox';
import mixin from './mixin';

export default React.createClass({
	displayName: 'MultipleChoice',

	mixins: [mixin],

	propTypes: {
		element: React.PropTypes.object.isRequired
	},


	render () {

		const {element} = this.props;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		return (
			<div className="multiplechoice widget required">
				<p className="question-label">{element.label}</p>
				<ul className="multiplechoice-options">
					{element.options.map((o, i) =>
						<Checkbox key={i} option={o} name={`${element.name}[]`} requirement={o.requirement}/>
					)}
				</ul>
			</div>
		);
	}
});
