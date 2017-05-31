import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const toggle = 'Collapsible:toggle';

export default class extends React.Component {
	static displayName = 'Collapsible';

	static propTypes = {
		title: PropTypes.string.isRequired,
		children: PropTypes.any,
		triangle: PropTypes.bool
	};

	static defaultProps = {
		triangle: true
	};

	state = {
		collapsed: true
	};

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed
		});
	};

	render () {

		let classes = cx({
			'collapsible': true,
			'collapsed': this.state.collapsed,
			'expanded': !this.state.collapsed
		});

		let titleClasses = cx({
			'collapsible-title': true,
			'open': !this.state.collapsed,
			'disclosure-triangle': this.props.triangle
		});

		return (
			<div className={classes}>
				<div className={titleClasses} onClick={this[toggle]}>{this.props.title}</div>
				{this.state.collapsed ? null : this.props.children}
			</div>
		);
	}
}
