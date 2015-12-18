import React from 'react';
import Router from 'react-router-component';
import Redirect from 'navigation/components/Redirect';
import Performance from './Performance';
import Activity from '../shared/Activity';
import Assignments from '../shared/Assignments';
import PageFrame from '../shared/PageFrame';
import SearchSortStore from '../../SearchSortStore';

import AssignmentListItem from './AssignmentListItem';

const ROUTES = [
	{path: '/activity(/*)', handler: PageFrame, pageContent: Activity},
	{path: '/performance/(:rootId)(/*)', handler: Performance},
	{path: '/(:rootId)(/*)', handler: Assignments},
	{}//not found
];

export default React.createClass({
	displayName: 'Assignments:Students:View',

	propTypes: {
		course: React.PropTypes.object.isRequired,
		assignments: React.PropTypes.object.isRequired
	},

	childContextTypes: {
		AssignmentListItem: React.PropTypes.object
	},

	getChildContext () {
		return {AssignmentListItem};
	},

	componentWillMount () {
		this.loadHistory();
	},

	loadHistory ({assignments} = this.props) {
		if(!assignments || !assignments.getHistory) {
			return Promise.reject('No assignments.getHistory?');
		}
		assignments.getHistory()
			.then(history => {
				console.log(history);
				Object.assign(SearchSortStore, {history});
			},
			e => {
				console.log(e);
			});
	},

	render () {
		const {course, assignments} = this.props;

		return React.createElement(Router.Locations, {contextual: true, ...this.props},
			...ROUTES.map(route =>
				route.path ?
				<Router.Location {...route}
					course={course}
					assignments={assignments}
				/>
				: React.createElement(Router.NotFound, {handler: Redirect, location: '/'})
			));
	}
});
