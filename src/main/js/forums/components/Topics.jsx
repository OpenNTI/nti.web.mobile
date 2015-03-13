'use strict';

var React = require('react');
var Link = require('react-router-component').Link;
var AnalyticsStore = require('analytics/Store');
var NTIID = require('dataserverinterface/utils/ntiids');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var TopicList = require('./TopicList');
var Loading = require('common/components/Loading');
var Store = require('../Store');
var StoreEvents = require('common/mixins/StoreEvents');
var LoadForum = require('../mixins/LoadForum');
var t = require('common/locale').scoped('FORUMS');
import ViewHeader from './widgets/ViewHeader';
import {FORUM} from '../Constants';
import Transition from 'common/thirdparty/ReactCSSTransitionWrapper';

var Topics = React.createClass({

	displayName: 'Topics',

	mixins: [NavigatableMixin, StoreEvents, LoadForum],

	backingStore: Store,

	getInitialState: function() {
		return {
			loading: true 
		};
	},

	componentWillUnmount: function() {
		AnalyticsStore.pushHistory(NTIID.decodeFromURI(this.props.forumId));
	},

	_getForum() {
		return Store.getForum(this.props.forumId);
	},

	_canCreateTopic() {
		var forum = this._getForum();
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
			return <Loading/>;
		}

		var {forumId} = this.props;
		var forumContents = Store.getObjectContents(forumId);

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

module.exports = Topics;
