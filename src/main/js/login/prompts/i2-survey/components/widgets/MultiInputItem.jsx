import React from 'react';

import getWidget from './';

import {optionLabel, optionValue} from './mixin';

export default React.createClass({
	displayName: 'MultiInputItem',

	propTypes: {
		option: React.PropTypes.any.isRequired,
		type: React.PropTypes.string,
		element: React.PropTypes.object
	},

	validate () {
		const w = this.widget;
		if (!w || !w.validate) {
			return true;
		}
		return w.validate();
	},

	render () {

		const {element, option} = this.props;
		const Widget = getWidget(element.subtype);

		const elem = {
			name: element.name + ':' + optionValue(option),
			required: element.required
		};

		return (
			<div className="multiinputitem">
				<p className="question-label">{optionLabel(option)}</p>
				<Widget element={elem} ref={x => this.widget = x} />
			</div>
		);
	}
});
