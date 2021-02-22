import './GlossaryEntry.scss';
import React from 'react';
import PropTypes from 'prop-types';

export default class GlossaryEntry extends React.Component {
	static propTypes = {
		entryid: PropTypes.string,
	};

	attachRef = x => (this.content = x);

	componentDidMount() {
		let entryEl = document.getElementById(this.props.entryid);
		// console.debug('didmount, %O', entryEl);
		if (entryEl) {
			this.content.innerHTML = entryEl.innerHTML;
		}
	}

	render() {
		return (
			<div {...this.props} className="glossary-entry">
				<div
					ref={this.attachRef}
					className="def small-9 columns small-centered"
				/>
			</div>
		);
	}
}
