import React from 'react';
import cx from 'classnames';

import mixin from './mixin';

export default React.createClass({
	displayName: 'Text',

	mixins: [mixin],

	propTypes: {
		element: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
		};
	},

	validate () {
		const {element} = this.props;
		if(!element.required) {
			return true;
		}
		let {value = ''} = this.state;
		let error = value.length === 0;
		this.setState({
			error
		});
		return !error;
	},

	onChange (e) {
		this.setState({ value: e.target.value, error: false });
	},

	render () {
		const {element} = this.props;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		const classes = cx('text', 'widget', {
			error: this.state.error,
			required: element.required
		});

		return (
			<div className={classes}>
				<label className="question-label">{element.label}</label>
				<input type="text" name={element.name} onChange={this.onChange} value={this.state.value}/>
			</div>
		);
	}
});
