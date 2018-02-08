import React from 'react';
import createReactClass from 'create-react-class';
import {scoped} from 'nti-lib-locale';

import Paging from '../mixins/Paging';

import List from './List';
import PageControls from './PageControls';

const DEFAULT_TEXT = {
	empty: 'There are no active discussions.'
};

const t = scoped('forums.topic.list', DEFAULT_TEXT);

export default createReactClass({
	displayName: 'TopicList',

	mixins: [Paging],

	componentDidMount () {
		this.setItemContentsState();
	},

	componentWillReceiveProps (nextProps) {
		this.setItemContentsState(nextProps);
	},

	setItemContentsState (props = this.props) {
		if (props.container) {
			// paging mixin expects to find list info in state.itemContents
			this.setState({
				itemContents: props.container
			});
		}
	},

	render () {
		let emptyText = t('emptyTopicList');

		let pageInfo = this.pagingInfo();

		return (
			<div>
				<List {...this.props} className="forum-topics" emptyText={emptyText} />
				<PageControls paging={pageInfo} />
			</div>
		);
	}

});
