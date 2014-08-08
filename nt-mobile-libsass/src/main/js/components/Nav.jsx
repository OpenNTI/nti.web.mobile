/** @jsx React.DOM */

var React = require('react/addons');

module.exports = React.createClass({
	render: function() {
		return (
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
						 		<select>
									<option value="husker">Chemistry of Beer</option>
									<option value="starbuck">Introduction to Water</option>
									<option value="hotdog">Intro to Human Physiology</option>
									<option value="hotdog">Law and Justice</option>
						        </select>
							</li>
							<li><a href="#" className="button">Browse Courses</a></li>
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
						this is content.
					</section>

					<a className="exit-off-canvas"></a>

				</div>
			</div>
		);
	}
});
