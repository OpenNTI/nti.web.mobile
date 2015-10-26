import React from 'react';

import Breadcrumb from 'common/components/BreadcrumbPath';
import RepliedTo from 'common/components/RepliedTo';
import {isFlag} from 'common/utils';

import Detail from 'content/components/discussions/Detail';
import Context from 'content/components/discussions/Context';

import ContentIcon from './ContentIcon';

export default React.createClass({
	displayName: 'Note',

	statics: {
		handles (item) {
			const {MimeType = ''} = item;
			return /note$/i.test(MimeType) && !item.isReply();
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
			<div className={`activity discussion-${item.isReply() ? 'reply' : 'detail'}`}>
				<div className="note heading">
					<ContentIcon item={item} />
					<Breadcrumb item={item} />
					{item.isReply()
						? (<RepliedTo item={item}/>)
						: isFlag('disable-context-in-activity') !== true && ( <Context item={item}/> )}
				</div>
				<Detail item={item} lite/>
				{/*<Actions item={item}/> -- Comment count, [edit] [delete]*/}
			</div>
		);

	}
});
