import React from 'react';
import cx from 'classnames';

import MatrixRow from './MatrixRow';
import mixin from './mixin';

export default React.createClass({
	displayName: 'Matrix',

	propTypes: {
		element: React.PropTypes.object.isRequired
	},

	mixins: [mixin],

	getInitialState () {
		return {};
	},

	componentWillMount () {
		this.rows = [];
	},

	validate () {
		let result = true;
		for(let i = 0; i < this.rows.length; i++) {
			result = this.rows[i].validate() && result;
		}
		this.setState({
			error: !result
		});
		return result;
	},

	render () {

		const {element} = this.props;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		const classes = cx('matrix', 'widget', {
			error: this.state.error,
			required: element.required
		});


		return (
			<div className={classes}>
				<div>{element.label}</div>
				<div className="questions">
					<div className="headings">
						<div/>
						{element.columns.map(c => <div key={c}>{c}</div>)}
					</div>
					{element.rows.map((r, i) => (
						<MatrixRow
							required={element.required}
							question={r}
							columns={element.columns}
							prefix={`${element.name}:`}
							key={i}
							ref={x => this.rows[i] = x}
						/>
					))}
				</div>
			</div>
		);
	}
});
