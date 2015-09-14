import React from 'react';
import t from 'common/locale';

export default React.createClass({
	displayName: 'ContentWidgetUnknown',

	propTypes: {
		item: React.PropTypes.object
	},

	componentDidMount () {
		if (typeof document === 'undefined') { return; }

		let {type} = this.props.item;
		const {refs: {el: dom}} = this;

		if (dom) {
			dom.appendChild(
				document.createComment(`Unknown Type: ${type}`));
		}
	},

	render () {
		return (
			<error className="unsupported-content" ref="el">
				<span>{t('COMING_SOON.singular', {subject: 'This content'})}</span>
			</error>
		);
	}
});
