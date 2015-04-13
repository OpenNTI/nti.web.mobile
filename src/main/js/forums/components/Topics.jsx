'use strict';

import React from 'react';
import {Link} from 'react-router-component';
import AnalyticsStore from 'analytics/Store';
import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import TopicList from './TopicList';
import Loading from 'common/components/Loading';
import paging from '../mixins/Paging';
import Store from '../Store';
import StoreEvents from 'common/mixins/StoreEvents';
import LoadForum from '../mixins/LoadForum';
import ViewHeader from './widgets/ViewHeader';
import {FORUM} from '../Constants';
import Transition from 'common/thirdparty/ReactCSSTransitionWrapper';
var t = require('common/locale').scoped('FORUMS');


export default React.createClass({

	displayName: 'Topics',

	mixins: [NavigatableMixin, StoreEvents, LoadForum],

	backingStore: Store,

	getInitialState: function() {
		return {
			loading: true
		};
	},

	componentWillUnmount: function() {
		AnalyticsStore.pushHistory(decodeFromURI(this.props.forumId));
	},

	_getForum() {
		return Store.getForum(this.props.forumId);
	},

	_canCreateTopic() {
		let forum = this._getForum();
		return !!(forum && forum.hasLink('add'));
	},

	_createTopicLink() {
		if (!this._canCreateTopic()) {
			return null;
		}
		return <Link className="action-link create-topic" href="/newtopic/">{t('createTopic')}</Link>;
	},

	render: function() {

		if (this.state.loading) {
			return <Loading />;
		}

		let {forumId} = this.props;
		let batchStart = paging.batchStart();
		let forumContents = Store.getForumContents(forumId, batchStart, paging.getPageSize());

		return (
			<div>
				<Transition transitionName="forums">
					<ViewHeader type={FORUM} />
					<section>
						{this._createTopicLink()}
						<div className="group-heading"><h3>Topics</h3></div>
						<TopicList container={forumContents}/>
					</section>
				</Transition>
			</div>
		);
	}

});
