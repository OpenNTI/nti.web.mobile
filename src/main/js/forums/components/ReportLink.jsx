import React from 'react';
import cx from 'classnames';
import {areYouSure} from 'prompts';

import {reportItem} from '../Actions';

import ItemChanges from 'common/mixins/ItemChanges';

export default React.createClass({
	displayName: 'ReportLink',
	mixins: [ItemChanges],

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	onClick () {
		areYouSure('Report this as inappropriate?').then(
			()=> {
				this.setState({
					busy: true
				});
				reportItem(this.props.item);
			},
			()=> {}
		);
	},

	render () {
		let {item} = this.props;

		let isReported = item.hasLink('flag.metoo');

		let Tag = isReported ? 'span' : 'a';

		let classNames = cx('icon-flag', {
			flagged: isReported
		});

		return (
			<Tag className={classNames} onClick={this.onClick}/>
		);
	}

});
