import React from 'react';

import Breadcrumb from 'common/components/BreadcrumbPath';
import {isFlag} from 'common/utils';

import Detail from 'content/components/discussions/Detail';
import Context from 'content/components/discussions/Context';

import ContentIcon from './ContentIcon';

export default React.createClass({
	displayName: 'Note',

	statics: {
		handles (item) {
			const {MimeType = ''} = item;
			return /note$/i.test(MimeType);
		}
	},

	propTypes: {
		item: React.PropTypes.any.isRequired
	},

	render () {

		let {item} = this.props;

		if (!item) {
			return null;
		}

		return (
			<div className="activity-note">
				<Breadcrumb item={item} showPrompt={item.isReply()}/>
				<div className={`activity ${item.isReply() ? 'reply' : 'detail'}`}>
					{item.isReply() ? null : (
						<div className="ugd note heading">
							<ContentIcon item={item} />
							{isFlag('disable-context-in-activity') !== true && (
								<Context item={item} className="activity"/>
							)}
						</div>
					)}
					<Detail item={item} lite/>
					{/*<Actions item={item}/> -- Comment count, [edit] [delete]*/}
				</div>
			</div>
		);
	}
});
