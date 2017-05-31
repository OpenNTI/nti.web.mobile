import List from './List';
import PageControls from './PageControls';
import Paging from '../mixins/Paging';
import React from 'react';
import createReactClass from 'create-react-class';
import {scoped} from 'nti-lib-locale';

let t = scoped('FORUMS');

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
