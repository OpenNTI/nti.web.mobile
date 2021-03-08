import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';

import { compose as Paging } from '../mixins/Paging';

import List from './List';
import PageControls from './PageControls';

const DEFAULT_TEXT = {
	empty: 'There are no active discussions.',
};

const t = scoped('forums.topic.list', DEFAULT_TEXT);

class TopicList extends React.Component {
	static propTypes = {
		container: PropTypes.object,
	};

	componentDidMount() {
		this.setItemContentsState();
	}

	componentDidUpdate(prevProps) {
		if (this.props.container !== prevProps.container) {
			this.setItemContentsState();
		}
	}

	setItemContentsState(props = this.props) {
		if (props.container) {
			// paging mixin expects to find list info in state.itemContents
			this.setState({
				itemContents: props.container,
			});
		}
	}

	render() {
		let emptyText = t('empty');

		let pageInfo = this.pagingInfo();

		return (
			<div>
				<List
					{...this.props}
					className="forum-topics"
					emptyText={emptyText}
				/>
				<PageControls paging={pageInfo} />
			</div>
		);
	}
}

export default decorate(TopicList, [Paging]);
