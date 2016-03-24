import React from 'react';

import mixin from './mixin';

export default React.createClass({
	displayName: 'Ordering',

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
				<ul className="ordering-options">
					{element.options.map((o, i) =>
						<label key={i}>
							<input type="text" pattern="\d*" size="3" key={i} name={`${element.name}-${o.label}`} requirement={o.requirement}/>
							<span>{o.label}</span>
						</label>

					)}
				</ul>
			</div>
		);
	}
});
