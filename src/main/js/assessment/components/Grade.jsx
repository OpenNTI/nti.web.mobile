import React from 'react';

export default React.createClass({
	displayName: 'Grade',

	propTypes: {
		value: React.PropTypes.any.isRequired
	},

	getInitialState () {
		return {
			grade: ''
		};
	},


	componentDidMount () {
		this.parseGrade(this.props.value);
	},


	componentWillReceiveProps (props) {
		this.parseGrade(props.value);
	},


	parseGrade (grade) {
		let n;
		if (typeof grade === 'number') {
			n = grade.toFixed(1);
			if (n.split('.')[1] === '0') {
				n = grade.toFixed(0);
			}
			grade = n;
		}
		let parts = grade.split(' ');

		this.setState({
			grade: parts[0],
			letter: parts.slice(1).join(' ')
		});

	},


	render () {
		let {grade} = this.state;
		return (
			<div className="grade">{grade}</div>
		);
	}
});
