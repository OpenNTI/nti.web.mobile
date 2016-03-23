import React from 'react';

import RadioOption from './RadioOption';
import mixin from './mixin';

export default React.createClass({
	displayName: 'Radio',

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
			<div className="radio widget">
				<div>{element.label}</div>
				<ul className="radio-options">
					{element.options.map((o, i) =>
						<RadioOption key={i} option={o} name={element.name}/>
					).filter(x => x)}
				</ul>
			</div>
		);
	}
});
