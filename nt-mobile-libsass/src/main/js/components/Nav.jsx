/** @jsx React.DOM */

var React = require('react/addons');
var Profile = require('./Profile');
var CourseSelector = require('./CourseSelector');
var BrowseCourseDropdown = require('./BrowseCourseDropdown');

module.exports = React.createClass({
	render: function() {
		return (
			<div>
				<div className="off-canvas-wrap" data-offcanvas>
					<div className="inner-wrap">
						<nav className="tab-bar">
							<section className="left-small">
								<a href="#" className="left-off-canvas-toggle menu-icon"><span></span></a>
							</section>
							<section className="middle tab-bar-section">
								<h1 className="title">NextThought</h1>
							</section>
							<section className="right-small">
								<a className="right-off-canvas-toggle menu-icon" href="#"><span></span></a>
							</section>
						</nav>
						<aside className="left-off-canvas-menu">
							<ul className="off-canvas-list">
								<li><label>My Courses <span className="label radius secondary">4</span></label></li>
								<li>
							 		<CourseSelector />
								</li>
								<li><a href="#" data-options="align:right" data-dropdown="drop2" className="button" >Browse Courses</a>
								</li>
							</ul>
						</aside>
						<aside className="right-off-canvas-menu">
							<ul className="off-canvas-list">
								<li><label>Recent Activity</label></li>
								<li><a href="#">Event 1</a></li>
								<li><a href="#">Event 2</a></li>
							</ul>
						</aside>

						<section className="main-section">
							<Profile />
						</section>

						<a className="exit-off-canvas"></a>
					</div>
				</div>
				<BrowseCourseDropdown />
			</div>
		);
	}
});
