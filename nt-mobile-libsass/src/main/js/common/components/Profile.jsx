/** @jsx React.DOM */

/*
	A sample page to show how different components could work, plus displays the size and orientation of device.
*/

var React = require('react/addons');
var Avatar = require('./Avatar');

module.exports = React.createClass({
	render: function() {
		return (
			<div className="profile-body">
				<ul className="small-block-grid-1 medium-block-grid-1 large-block-grid-1">
					<li>
						<ul className="small-block-grid-1 medium-block-grid-2 large-block-grid-3">
							<li><Avatar /></li>
							<li>
								<p className="panel">
									<strong className="show-for-small-only">This text is shown only on a small screen.</strong>
									<strong className="show-for-medium-up">This text is shown on medium screens and up.</strong>
									<strong className="show-for-medium-only">This text is shown only on a medium screen.</strong>
									<strong className="show-for-large-up">This text is shown on large screens and up.</strong>
									<strong className="show-for-large-only">This text is shown only on a large screen.</strong>
									<strong className="show-for-xlarge-up">This text is shown on xlarge screens and up.</strong>
									<strong className="show-for-xlarge-only">This text is shown only on an xlarge screen.</strong>
									<strong className="show-for-xxlarge-up">This text is shown on xxlarge screens and up.</strong>
								</p>
							</li>
							<li>
								<p className="panel">
									<strong className="hide-for-small-only">You are <em>not</em> on a small screen.</strong>
									<strong className="hide-for-medium-up">You are <em>not</em> on a medium, large, xlarge, or xxlarge screen.</strong>
									<strong className="hide-for-medium-only">You are <em>not</em> on a medium screen.</strong>
									<strong className="hide-for-large-up">You are <em>not</em> on a large, xlarge, or xxlarge screen.</strong>
									<strong className="hide-for-large-only">You are <em>not</em> on a large screen.</strong>
									<strong className="hide-for-xlarge-up">You are <em>not</em> on an xlarge screen and up.</strong>
									<strong className="hide-for-xlarge-only">You are <em>not</em> on an xlarge screen.</strong>
									<strong className="hide-for-xxlarge-up">You are <em>not</em> on an xxlarge screen.</strong>
								</p>
							</li>
							<li>
								<p className="panel">
									<strong className="show-for-landscape">You are in landscape orientation.</strong>
									<strong className="show-for-portrait">You are in portrait orientation.</strong>
								</p>
							</li>
							<li>
								<p className="panel">
									<strong className="show-for-touch">You are on a touch-enabled device.</strong>
									<strong className="hide-for-touch">You are not on a touch-enabled device.</strong>
								</p>
							</li>
							<li>
								<p className="panel">
									<strong className="hidden-for-small-only">You are <em>not</em> on a small screen.</strong>
									<strong className="hidden-for-medium-up">You are <em>not</em> on a medium, large, xlarge, or xxlarge screen.</strong>
									<strong className="hidden-for-medium-only">You are <em>not</em> on a medium screen.</strong>
									<strong className="hidden-for-large-up">You are <em>not</em> on a large, xlarge, or xxlarge screen.</strong>
									<strong className="hidden-for-large-only">You are <em>not</em> on a large screen.</strong>
									<strong className="hidden-for-xlarge-up">You are <em>not</em> on an xlarge screen and up.</strong>
									<strong className="hidden-for-xlarge-only">You are <em>not</em> on an xlarge screen.</strong>
									<strong className="hidden-for-xxlarge-up">You are <em>not</em> on an xxlarge screen.</strong>
								</p>
							</li>
							<li>
								<p className="panel">
									<strong className="visible-for-small-only">This text is shown only on a small screen.</strong>
									<strong className="visible-for-medium-up">This text is shown on medium screens and up.</strong>
									<strong className="visible-for-medium-only">This text is shown only on a medium screen.</strong>
									<strong className="visible-for-large-up">This text is shown on large screens and up.</strong>
									<strong className="visible-for-large-only">This text is shown only on a large screen.</strong>
									<strong className="visible-for-xlarge-up">This text is shown on xlarge screens and up.</strong>
									<strong className="visible-for-xlarge-only">This text is shown only on an xlarge screen.</strong>
									<strong className="visible-for-xxlarge-up">This text is shown on xxlarge screens and up.</strong>
								</p>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		);
	}
});
