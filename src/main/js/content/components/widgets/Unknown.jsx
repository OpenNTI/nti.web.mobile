import React from 'react';
import PropTypes from 'prop-types';
import t from 'nti-lib-locale';

export default class ContentWidgetUnknown extends React.Component {

	static propTypes = {
		item: PropTypes.object
	}

	attachRef = x => this.el = x

	componentDidMount () {
		if (typeof document === 'undefined') { return; }

		let {type} = this.props.item;
		const {el: dom} = this;

		if (dom) {
			dom.appendChild(
				document.createComment(`Unknown Type: ${type}`));
		}
	}

	render () {
		return (
			<error className="unsupported-content" ref={this.attachRef}>
				<span>{t('COMING_SOON.singular', {subject: 'This content'})}</span>
			</error>
		);
	}
}
