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
		let dom = React.findDOMNode(this);

		if (dom) {
			dom.appendChild(
				document.createComment(`Unknown Type: ${type}`));
		}
	},

	render () {
		return (
			<error className="unsupported-content">
				<span>{t('COMING_SOON.singular', {subject: 'This content'})}</span>
			</error>
		);
	}
});
