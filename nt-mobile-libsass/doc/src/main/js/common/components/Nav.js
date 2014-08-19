/** @jsx React.DOM */

var React = require('react/addons');
var Profile = require('./Profile');
var CourseSelector = require('./CourseSelector');
var BrowseCourseDropdown = require('./BrowseCourseDropdown');

module.exports = React.createClass({
	render: function() {
		return (
			React.DOM.div(null, 
				React.DOM.div( {className:"off-canvas-wrap", 'data-offcanvas':true}, 
					React.DOM.div( {className:"inner-wrap"}, 
						React.DOM.nav( {className:"tab-bar"}, 
							React.DOM.section( {className:"left-small"}, 
								React.DOM.a( {href:"#", className:"left-off-canvas-toggle menu-icon"}, React.DOM.span(null))
							),
							React.DOM.section( {className:"middle tab-bar-section"}, 
								React.DOM.h1( {className:"title"}, "NextThought")
							),
							React.DOM.section( {className:"right-small"}, 
								React.DOM.a( {className:"right-off-canvas-toggle menu-icon", href:"#"}, React.DOM.span(null))
							)
						),
						React.DOM.aside( {className:"left-off-canvas-menu"}, 
							React.DOM.ul( {className:"off-canvas-list"}, 
								React.DOM.li(null, React.DOM.label(null, "My Courses ", React.DOM.span( {className:"label radius secondary"}, "4"))),
								React.DOM.li(null, 
							 		CourseSelector(null )
								),
								React.DOM.li(null, React.DOM.a( {href:"#", 'data-options':"align:right", 'data-dropdown':"drop2", className:"button"} , "Browse Courses")
								)
							)
						),
						React.DOM.aside( {className:"right-off-canvas-menu"}, 
							React.DOM.ul( {className:"off-canvas-list"}, 
								React.DOM.li(null, React.DOM.label(null, "Recent Activity")),
								React.DOM.li(null, React.DOM.a( {href:"#"}, "Event 1")),
								React.DOM.li(null, React.DOM.a( {href:"#"}, "Event 2"))
							)
						),

						React.DOM.section( {className:"main-section"}, 
							Profile(null )
						),

						React.DOM.a( {className:"exit-off-canvas"})
					)
				),
				BrowseCourseDropdown(null )
			)
		);
	}
});
