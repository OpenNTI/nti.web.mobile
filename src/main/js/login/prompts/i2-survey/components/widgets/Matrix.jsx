import React from 'react';

import mixin from './mixin';

export default React.createClass({
	displayName: 'Matrix',

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
			<div className="widget">
				<div>{element.label}</div>
				<div className="matrix">
					<div className="headings">
						<div/>
						{element.columns.map(c => <div key={c}>{c}</div>)}
					</div>
					{element.rows.map(r => (
						<div className="question" key={r}>
							<div>{r}</div>
							{element.columns.map(c => (
								<label key={c}>
									<input type="radio" name={`${element.name}-${r}`} />
									<span>{c}</span>
								</label>
							))}
						</div>
					))}
				</div>
			</div>
		);
	}
});
