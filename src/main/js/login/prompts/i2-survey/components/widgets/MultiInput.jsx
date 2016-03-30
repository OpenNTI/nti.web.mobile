import React from 'react';
import cx from 'classnames';

import MultiInputItem from './MultiInputItem';

export default React.createClass({
	displayName: 'MultiInput',

	propTypes: {
		element: React.PropTypes.object.isRequired
	},


	componentWillMount () {
		this.elements = [];
	},


	validate () {
		let result = true;
		for(let i = 0; i < this.elements.length; i++) {
			let e = this.elements[i];
			if(e && e.validate && !e.validate()) {
				result = false;
			}
		}
		return result;
	},


	attachRef (r) {
		r && this.elements.push(r);
	},


	render () {

		const {element} = this.props;

		const classes = cx('multiinput', 'widget', {
			required: element.required
		});

		return (
			<div className={classes}>
				<p className="question-label">{element.label}</p>
				{element.options.map((o, i) => (<MultiInputItem key={i} option={o} element={element} ref={this.attachRef} />))}
			</div>
		);
	}
});
