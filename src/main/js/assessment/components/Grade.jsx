import PropTypes from 'prop-types';
import React from 'react';

export default class extends React.Component {
	static displayName = 'Grade';

	static propTypes = {
		value: PropTypes.any.isRequired,
	};

	state = {
		grade: '',
	};

	componentDidMount() {
		this.parseGrade(this.props.value);
	}

	componentDidUpdate(props) {
		const { value } = this.props;
		if (props.value !== value) {
			this.parseGrade(value);
		}
	}

	parseGrade = grade => {
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
			letter: parts.slice(1).join(' '),
		});
	};

	render() {
		let { grade } = this.state;
		return <div className="grade">{grade}</div>;
	}
}
