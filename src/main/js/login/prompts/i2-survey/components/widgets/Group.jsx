import React from 'react';

import mixin from './mixin';
import widget from './';

export default React.createClass({

	propTypes: {
		element: React.PropTypes.object.isRequired
	},

	mixins: [mixin],

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

	render () {
		const {element} = this.props;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		return (
			<div className="group">
			{element.elements.map((e, i) => {
				const Widget = widget(e.type);
				return <div key={i}><Widget ref={x => this.elements[i] = x} element={e} requirement={e.requirement} /></div>;
			})}
			</div>
		);
	}
});
