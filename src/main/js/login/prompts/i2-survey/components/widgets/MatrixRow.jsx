import React from 'react';
import cx from 'classnames';

export default React.createClass({
	displayName: 'MatrixRow',

	propTypes: {
		prefix: React.PropTypes.string,
		question: React.PropTypes.string.isRequired,
		columns: React.PropTypes.array.isRequired,
		required: React.PropTypes.bool
	},

	getInitialState () {
		return {};
	},

	validate () {
		let hasSelected = !!this.node.querySelector(':checked');
		this.setState({
			error: !hasSelected
		});
		return hasSelected;
	},

	onChange () {
		this.validate();
	},

	render () {

		const {question, columns, prefix, required} = this.props;

		const classes = cx('question', {error: this.state.error, required});

		return (
			<div className={classes} ref={x => this.node = x}>
				<div className="question-label"><span>{question}</span></div>
				{columns.map(c => (
					<label key={c}>
						<input type="radio" name={`${prefix}${question}`} value={c} onChange={this.onChange}/>
						<span>{c}</span>
					</label>
				))}
			</div>
		);
	}
});
