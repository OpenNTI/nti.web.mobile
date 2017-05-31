import PropTypes from 'prop-types';
import React from 'react';

export default class extends React.Component {
	static displayName = 'AddEntryButton';

	static propTypes = {
		onClick: PropTypes.func.isRequired
	};

	onClick = (e) => {
		e.preventDefault();
		e.stopPropagation();

		this.props.onClick.call();
	};

	render () {
		return (
			<a className="add-entry-button button tiny" onClick={this.onClick}>Add Entry</a>
		);
	}
}
