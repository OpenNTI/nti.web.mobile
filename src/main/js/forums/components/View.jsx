/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Router = require('react-router-component');

var Store = require('../Store');
var Api = require('../Api');
var Constants = require('../Constants');

var Bin = require('./views/Bin');
var FindBin = require('./FindBin');
var Redirect = require('navigation/components/Redirect');
var Breadcrumb = require('common/components/Breadcrumb');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var Err = require('common/components/Error');

var Loading = require('common/components/Loading');

var View = React.createClass({

	displayName: 'discussions/View',

	mixins: [NavigatableMixin],

	getInitialState: function() {
		return {
			loading: false
		};
	},

	componentDidMount: function() {
		if(!Store.getDiscussions(this._courseId())) {
			this.setState({
				loading: true
			});
			Store.addChangeListener(this._storeChanged);
			this._load();
		}
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChanged);
	},

	_load: function() {
		var {course} = this.props;
		Api.loadDiscussions(this.props.course)
		.then(
			result => {
				Store.setDiscussions(course.getID(), result);
				Store.setCourseId(this._courseId());
			},
			reason => {
				// TODO: handle load failure
				console.error('Failed to load discussions', reason);
			});
	},

	_storeChanged: function(event) {
		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case Constants.DISCUSSIONS_CHANGED:
				if(event.courseId === this._courseId()) {
					this.setState({
						loading: false
					});	
				}
				break;
		}
	},

	_courseId: function() {
		return this.props.course && this.props.course.getID();
	},

	_defaultBinUri: function(discussions) {
		if (discussions) {
			var key = Object.keys(discussions)[0];
			return `/${key}/`;
		}
		return '/loading';
	},

	__getContext: function() {
		var getContextFromProvider = Breadcrumb.noContextProvider;
		var href = this.makeHref('/', true);
		return getContextFromProvider(this.props).then(function(context) {
			context.push({
				label: 'Discussions',
				href: href
			});
			return context;
		});
	},

	render: function() {

		var course = this.props.course;
		if (!course) {
			console.log('No props.course?');
			return;
		}
		var courseId = this._courseId();
		var discussions = Store.getDiscussions(courseId);

		if (this.state.loading || !discussions) {
			return <Loading />;
		}

		if (discussions.isError) {
			return <Err error={discussions.error} />;
		}

		return (
			<div className="forums-wrapper">
				<Router.Locations contextual>
					<Router.Location path="/(#:nav)"
										handler={Redirect}
										location={this._defaultBinUri(discussions)}
										basePath={this.props.basePath} />

					<Router.Location path="/jump/:boardId/:forumId/*"
										discussions={discussions}
										handler={FindBin} />

					<Router.Location path="/:binName/*(#:nav)"
										handler={Bin}
										discussions={discussions}
										courseId={courseId}
										contextProvider={this.__getContext}
										basePath={this.props.basePath} />

				</Router.Locations>
			</div>
		);
	}

});

module.exports = View;
