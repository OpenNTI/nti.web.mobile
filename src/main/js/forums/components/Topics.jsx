import PropTypes from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import {Link} from 'react-router-component';

import {addHistory} from 'nti-analytics';

import Transition from 'react-transition-group/CSSTransitionGroup';

import {Error as Err, Loading, Mixins} from 'nti-web-commons';

import {scoped} from 'nti-lib-locale';

import {StoreEventsMixin} from 'nti-lib-store';

import {decodeFromURI} from 'nti-lib-ntiids';

import paging from '../mixins/Paging';
import LoadForum from '../mixins/LoadForum';

import Store from '../Store';

import TopicList from './TopicList';
import ViewHeader from './widgets/ViewHeader';
import {FORUM} from '../Constants';


const t = scoped('FORUMS');


export default createReactClass({
	displayName: 'Topics',

	mixins: [Mixins.NavigatableMixin, StoreEventsMixin, LoadForum],

	propTypes: {
		forumId: PropTypes.string
	},

	backingStore: Store,

	getInitialState () {
		return {
			loading: true
		};
	},

	componentWillUnmount () {
		addHistory(decodeFromURI(this.props.forumId));
	},

	getForum () {
		return Store.getForum(this.props.forumId);
	},

	canCreateTopic () {
		let forum = this.getForum();
		return !!(forum && forum.hasLink('add'));
	},

	createTopicLink () {
		if (!this.canCreateTopic()) {
			return null;
		}
		return <Link className="action-link create-topic" href="/newtopic/">{t('createTopic')}</Link>;
	},

	render () {

		if (this.state.loading) {
			return <Loading.Mask />;
		}

		let {forumId} = this.props;
		let batchStart = paging.batchStart();
		let forumContents = Store.getForumContents(forumId, batchStart, paging.getPageSize());

		if (!forumContents) {
			return <Err error="There was a problem loading the forum. Please try again later." />;
		}

		return (
			<div>
				<Transition transitionName="fadeOutIn"
					transitionAppear
					transitionAppearTimeout={500}
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}
					>
					<ViewHeader type={FORUM} />
					<section>
						{this.createTopicLink()}
						<div className="group-heading"><h3>Topics</h3></div>
						<TopicList container={forumContents}/>
					</section>
				</Transition>
			</div>
		);
	}

});
