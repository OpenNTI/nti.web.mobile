import React from 'react';
import cx from 'classnames';
import {areYouSure} from 'prompts';

import {scoped} from 'nti-lib-locale';
import {Mixins} from 'nti-web-commons';

const t = scoped('DISCUSSIONS.ACTIONS');

export default React.createClass({
	displayName: 'ReportLink',
	mixins: [Mixins.ItemChanges],

	propTypes: {
		icon: React.PropTypes.bool,
		label: React.PropTypes.bool,
		item: React.PropTypes.object.isRequired,

		className: React.PropTypes.string
	},


	getDefaultProps () {
		return {
			label: true
		};
	},


	onClick (e) {
		e.preventDefault();
		e.stopPropagation();

		areYouSure('Report this as inappropriate?').then(
			()=> {
				this.props.item.flag();
			},
			()=> {}
		);
	},

	render () {
		const {className, icon, item, label} = this.props;
		const isReported = item.hasLink('flag.metoo');

		return (
			<a className={cx(className, { flagged: isReported })} onClick={this.onClick}>
				{icon && ( <i className="icon-flag"/> )}
				{label && t(isReported ? 'flagged' : 'flag')}
			</a>
		);
	}

});
