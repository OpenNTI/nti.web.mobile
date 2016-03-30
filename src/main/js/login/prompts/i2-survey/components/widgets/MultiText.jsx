import React from 'react';
import cx from 'classnames';

import MultiTextItem from './MultiTextItem';

export default React.createClass({
	displayName: 'MultiText',

	propTypes: {
		element: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
			values: []
		};
	},


	attachRef (r) {
		r && this.inputs.push(r);
	},

	onInputChange (index, value) {
		const {values} = this.state;
		values[index] = value;
		this.setState({
			values
		});
	},

	render () {

		const {element} = this.props;
		let {values} = this.state;

		// eliminate empty values
		values = values.filter(x => x.trim().length > 0);

		// one new/additional/empty input
		values.push('');

		const classes = cx('multitext', 'widget');

		return (
			<div className={classes}>
				<p className="question-label">{element.label}</p>
				{values.map((v, i) => (
					<MultiTextItem
						key={i}
						index={i}
						element={element}
						value={v}
						onChange={this.onInputChange} />
				))}
			</div>
		);
	}
});
