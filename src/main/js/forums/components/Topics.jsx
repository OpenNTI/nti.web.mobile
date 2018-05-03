import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {Link} from 'react-router-component';
import {addHistory} from '@nti/lib-analytics';
import {scoped} from '@nti/lib-locale';
import {decodeFromURI} from '@nti/lib-ntiids';
import {StoreEventsMixin} from '@nti/lib-store';
import {Error as Err, Loading, Mixins} from '@nti/web-commons';

import paging from '../mixins/Paging';
import LoadForum from '../mixins/LoadForum';
import Store from '../Store';
import {FORUM} from '../Constants';

import TopicList from './TopicList';
import ViewHeader from './widgets/ViewHeader';

const DEFAULT_TEXT = {
	create: 'Create a discussion',
};

const t = scoped('forums.topic', DEFAULT_TEXT);
const Transition = x => <CSSTransition appear classNames="fade-out-in" timeout={500} {...x}/>;


export default createReactClass({
	displayName: 'Topics',

	mixins: [Mixins.NavigatableMixin, StoreEventsMixin, LoadForum],

	propTypes: {
		forumId: PropTypes.string,
		forum: PropTypes.object
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
		return <Link className="action-link create-topic" href="/newtopic/">{t('create')}</Link>;
	},

	render () {

		if (this.state.loading) {
			return <Loading.Mask />;
		}

		let {forumId, forum} = this.props;
		let batchStart = paging.batchStart();
		let forumContents = forum || Store.getForumContents(forumId, batchStart, paging.getPageSize());

		if (!forumContents) {
			return <Err error="There was a problem loading the forum. Please try again later." />;
		}

		return (
			<div>
				<TransitionGroup>
					<Transition key="topics">
						<div>
							<ViewHeader type={FORUM} />
							<section>
								{this.createTopicLink()}
								<div className="group-heading"><h3>Topics</h3></div>
								<TopicList container={forumContents}/>
							</section>
						</div>
					</Transition>
				</TransitionGroup>
			</div>
		);
	}

});
