import React from 'react';

import Detail from 'content/components/discussions/Detail';

import Mixin from './Mixin';

import ContentIcon from './ContentIcon';
import Breadcrumb from './Breadcrumb';
import Context from 'content/components/discussions/Context';

export default React.createClass({
	displayName: 'Note',
	mixins: [Mixin],

	statics: {
		mimeType: /note$/i
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
					{item.isReply() ? null : ( <Context item={item}/> )}
				</div>
				<Detail item={item} lite/>
				{/*<Actions item={item}/> -- Comment count, [edit] [delete]*/}
			</div>
		);

	}
});
