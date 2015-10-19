import React from 'react';

export default React.createClass({
	displayName: 'Legend',

	propTypes: {
		items: React.PropTypes.array,
		colors: React.PropTypes.object
	},

	render () {
		const {props: {colors, items}} = this;

		if (!items || !(items.length > 1)) { // the "!" catches the case where length is not numeric AND length is less than 2.
			return null;
		}

		return (
			<div className="legend">
				{items.map((name, i)=>

					<div key={i + name} className="legend-item">
						<span className="legend-swatch" style={{background: colors[name]}}/>
						{name}
					</div>

				)}
			</div>
		);
	}
});
