/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
// var Router = require('react-router-component');

var Bin = require('./Bin');

// var NotFoundView = require('notfound/components/NotFoundView');

module.exports = React.createClass({

	// _getRoutes(discussions) {
	// 	var {discussions, basePath} = this.props;
	// 	return Object.keys(discussions).map(binName => {
	// 		return <Router.Location
	// 			key={binName}
	// 			path={binName + '/'}
	// 			handler={Bin}
	// 			bin={discussions[binName]}
	// 			basePath={basePath}
	// 		/>;
	// 	});
	// },

	render: function() {

		debugger;
		// var routes = this._getRoutes();

		// routes.push(<Router.NotFound handler={NotFoundView} />);

		return (
			<div>
				<p>Bins. {this.props.binName}</p>
				<div>(course name) discussions</div>
			</div>
		);
	}

});


/*
	<Router.Location path="/(#:nav)"
					handler={Bin}
					discussions={discussions}
					groupId={groupId}
					course={course}
					basePath={basePath} />											

	<Router.Location path="/:boardId/(#:nav)"
					handler={Bin}
					discussions={discussions}
					groupId={groupId}
					course={course}
					basePath={basePath} />

	<Router.Location path="/:boardId/:forumId/(#:nav)"
					groupId={groupId}
					handler={Forum}
					course={course}
					basePath={basePath} />

	<Router.Location path="/:boardId/:forumId/:topicId/(#:nav)"
					handler={Topic}
					course={course}
					basePath={basePath} />

	<Router.Location path="/:boardId/:forumId/:topicId/:postId/(#:nav)"
					handler={Post}
					course={course}
					basePath={basePath} />

*/