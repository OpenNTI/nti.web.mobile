import React from 'react';

import Store from '../Store';
import Api from '../Api';
import {DISCUSSIONS_CHANGED} from '../Constants';
import StoreEvents from 'common/mixins/StoreEvents';
import keyFor from '../utils/key-for-item';

import Err from 'common/components/Error';
import Loading from 'common/components/Loading';
import ForumBin from './widgets/ForumBin';


export default React.createClass({
	displayName: 'ForumListView',

	mixins: [
		StoreEvents
	],

	backingStore: Store,
	backingStoreEventHandlers: {
		[DISCUSSIONS_CHANGED]: '_discussionsChangedHandler'
	},


	_discussionsChangedHandler(event) {
		if(event.courseId === this._courseId()) {
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
		if(!Store.getDiscussions(this._courseId())) {
			this.setState({
				loading: true
			});
			this._load();
		}
	},

	_load() {
		var {course} = this.props;
		Api.loadDiscussions(course)
		.then(
			result => {
				Store.setDiscussions(course.getID(), result);
				Store.setCourseId(this._courseId());
			},
			reason => {
				console.error('Failed to load discussions', reason);
				this.setState({
					error: reason
				});
			});
	},

	_courseId() {
		return this.props.course && this.props.course.getID();
	},

	render () {

		if (this.state.loading) {
			return <Loading />;
		}

		var courseId = this._courseId();
		var discussions = Store.getDiscussions(courseId);
		let err = this.state.error || ((discussions||{}).isError ? discussions.error : null);

		if (err) {
			return <Err error={discussions.error} />;
		}

		return (
			<div>
				<div>ForumListView</div>
				<nav className="forum">
					<ul>
	 					{
	 						//convenient that the order we want the bins happens to be alphabeetical enrolled, open, other
	 						Array.sort(Object.keys(discussions)).map(key => {
	 							let bin = discussions[key];
	 							let reactkey = keyFor(bin);
	 							return <li key={reactkey}><ForumBin title={key} bin={bin} /></li>;
	 						})
	 					}
					</ul>
				</nav>
			</div>
		);
	}
});
