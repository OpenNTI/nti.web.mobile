import React from 'react';

import Transition from 'common/thirdparty/ReactCSSTransitionWrapper';

import Err from 'common/components/Error';
import Loading from 'common/components/Loading';

import StoreEvents from 'common/mixins/StoreEvents';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import {scoped} from 'common/locale';

import keyFor from '../utils/key-for-item';

import Store from '../Store';
import Api from '../Api';
import {DISCUSSIONS_CHANGED} from '../Constants';

import ForumBin from './widgets/ForumBin';


const t = scoped('FORUMS.groupTitles');
const discussionsChanged = 'ForumListView:discussionsChangedHandler';

export default React.createClass({
	displayName: 'ForumListView',

	mixins: [
		StoreEvents, NavigatableMixin
	],

	propTypes: {
		/*probably shouldn't be called "course" and should probably just be an interface so
			"Forums" do 	not need to know its a course or reference it by "course" */
		course: React.PropTypes.object
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		[DISCUSSIONS_CHANGED]: discussionsChanged
	},

	[discussionsChanged](event) {
		if(event.courseId === this.getCourseId()) {
			this.setState({
				loading: false
			});
		}
	},

	getInitialState() {
		return {
			loading: true
		};
	},

	componentDidMount() {
		if(!Store.getDiscussions(this.getCourseId())) {
			this.setState({
				loading: true
			});
			this.load();
		}
		else {
			this.setState({
				loading: false
			});
		}
	},

	load() {
		let {course} = this.props;
		Api.loadDiscussions(course)
		.then(
			result => {
				Store.setDiscussions(course.getID(), result);
				Store.setCourseId(this.getCourseId());
			},
			reason => {
				console.error('Failed to load discussions', reason);
				this.setState({
					error: reason
				});
			});
	},

	getCourseId() {
		return this.props.course && this.props.course.getID();
	},

	render () {

		if (this.state.loading) {
			return <Loading />;
		}

		let courseId = this.getCourseId();
		let discussions = Store.getDiscussions(courseId);
		let err = this.state.error || ((discussions || {}).isError ? discussions.error : null);

		if (err) {
			return <Err error={discussions.error} />;
		}

		return (
			<div>
				<Transition transitionName="forums">
					<nav className="forum">
						<ul>
							{
								//convenient that the order we want the bins happens to be alphabeetical enrolled, open, other
								Array.sort(Object.keys(discussions)).map(key => {
									let bin = discussions[key];
									let reactkey = keyFor(bin);
									return <li key={reactkey}><ForumBin title={t(key.toLowerCase())} bin={bin} /></li>;
								})
							}
						</ul>
					</nav>
				</Transition>
			</div>
		);
	}
});
