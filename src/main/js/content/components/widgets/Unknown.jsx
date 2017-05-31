import PropTypes from 'prop-types';
import React from 'react';
import t from 'nti-lib-locale';

export default class extends React.Component {
    static displayName = 'ContentWidgetUnknown';

    static propTypes = {
		item: PropTypes.object
	};

    componentDidMount() {
		if (typeof document === 'undefined') { return; }

		let {type} = this.props.item;
		const {el: dom} = this;

		if (dom) {
			dom.appendChild(
				document.createComment(`Unknown Type: ${type}`));
		}
	}

    render() {
		return (
			<error className="unsupported-content" ref={el => this.el = el}>
				<span>{t('COMING_SOON.singular', {subject: 'This content'})}</span>
			</error>
		);
	}
}
