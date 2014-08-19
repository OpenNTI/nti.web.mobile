/** @jsx React.DOM */

/*
	A sample page to show how different components could work, plus displays the size and orientation of device.
*/

var React = require('react/addons');
var Avatar = require('./Avatar');

module.exports = React.createClass({
	render: function() {
		return (
			React.DOM.div( {className:"profile-body"}, 
				React.DOM.ul( {className:"small-block-grid-1 medium-block-grid-1 large-block-grid-1"}, 
					React.DOM.li(null, 
						React.DOM.ul( {className:"small-block-grid-1 medium-block-grid-2 large-block-grid-3"}, 
							React.DOM.li(null, Avatar(null )),
							React.DOM.li(null, 
								React.DOM.p( {className:"panel"}, 
									React.DOM.strong( {className:"show-for-small-only"}, "This text is shown only on a small screen."),
									React.DOM.strong( {className:"show-for-medium-up"}, "This text is shown on medium screens and up."),
									React.DOM.strong( {className:"show-for-medium-only"}, "This text is shown only on a medium screen."),
									React.DOM.strong( {className:"show-for-large-up"}, "This text is shown on large screens and up."),
									React.DOM.strong( {className:"show-for-large-only"}, "This text is shown only on a large screen."),
									React.DOM.strong( {className:"show-for-xlarge-up"}, "This text is shown on xlarge screens and up."),
									React.DOM.strong( {className:"show-for-xlarge-only"}, "This text is shown only on an xlarge screen."),
									React.DOM.strong( {className:"show-for-xxlarge-up"}, "This text is shown on xxlarge screens and up.")
								)
							),
							React.DOM.li(null, 
								React.DOM.p( {className:"panel"}, 
									React.DOM.strong( {className:"hide-for-small-only"}, "You are ", React.DOM.em(null, "not"), " on a small screen."),
									React.DOM.strong( {className:"hide-for-medium-up"}, "You are ", React.DOM.em(null, "not"), " on a medium, large, xlarge, or xxlarge screen."),
									React.DOM.strong( {className:"hide-for-medium-only"}, "You are ", React.DOM.em(null, "not"), " on a medium screen."),
									React.DOM.strong( {className:"hide-for-large-up"}, "You are ", React.DOM.em(null, "not"), " on a large, xlarge, or xxlarge screen."),
									React.DOM.strong( {className:"hide-for-large-only"}, "You are ", React.DOM.em(null, "not"), " on a large screen."),
									React.DOM.strong( {className:"hide-for-xlarge-up"}, "You are ", React.DOM.em(null, "not"), " on an xlarge screen and up."),
									React.DOM.strong( {className:"hide-for-xlarge-only"}, "You are ", React.DOM.em(null, "not"), " on an xlarge screen."),
									React.DOM.strong( {className:"hide-for-xxlarge-up"}, "You are ", React.DOM.em(null, "not"), " on an xxlarge screen.")
								)
							),
							React.DOM.li(null, 
								React.DOM.p( {className:"panel"}, 
									React.DOM.strong( {className:"show-for-landscape"}, "You are in landscape orientation."),
									React.DOM.strong( {className:"show-for-portrait"}, "You are in portrait orientation.")
								)
							),
							React.DOM.li(null, 
								React.DOM.p( {className:"panel"}, 
									React.DOM.strong( {className:"show-for-touch"}, "You are on a touch-enabled device."),
									React.DOM.strong( {className:"hide-for-touch"}, "You are not on a touch-enabled device.")
								)
							),
							React.DOM.li(null, 
								React.DOM.p( {className:"panel"}, 
									React.DOM.strong( {className:"hidden-for-small-only"}, "You are ", React.DOM.em(null, "not"), " on a small screen."),
									React.DOM.strong( {className:"hidden-for-medium-up"}, "You are ", React.DOM.em(null, "not"), " on a medium, large, xlarge, or xxlarge screen."),
									React.DOM.strong( {className:"hidden-for-medium-only"}, "You are ", React.DOM.em(null, "not"), " on a medium screen."),
									React.DOM.strong( {className:"hidden-for-large-up"}, "You are ", React.DOM.em(null, "not"), " on a large, xlarge, or xxlarge screen."),
									React.DOM.strong( {className:"hidden-for-large-only"}, "You are ", React.DOM.em(null, "not"), " on a large screen."),
									React.DOM.strong( {className:"hidden-for-xlarge-up"}, "You are ", React.DOM.em(null, "not"), " on an xlarge screen and up."),
									React.DOM.strong( {className:"hidden-for-xlarge-only"}, "You are ", React.DOM.em(null, "not"), " on an xlarge screen."),
									React.DOM.strong( {className:"hidden-for-xxlarge-up"}, "You are ", React.DOM.em(null, "not"), " on an xxlarge screen.")
								)
							),
							React.DOM.li(null, 
								React.DOM.p( {className:"panel"}, 
									React.DOM.strong( {className:"visible-for-small-only"}, "This text is shown only on a small screen."),
									React.DOM.strong( {className:"visible-for-medium-up"}, "This text is shown on medium screens and up."),
									React.DOM.strong( {className:"visible-for-medium-only"}, "This text is shown only on a medium screen."),
									React.DOM.strong( {className:"visible-for-large-up"}, "This text is shown on large screens and up."),
									React.DOM.strong( {className:"visible-for-large-only"}, "This text is shown only on a large screen."),
									React.DOM.strong( {className:"visible-for-xlarge-up"}, "This text is shown on xlarge screens and up."),
									React.DOM.strong( {className:"visible-for-xlarge-only"}, "This text is shown only on an xlarge screen."),
									React.DOM.strong( {className:"visible-for-xxlarge-up"}, "This text is shown on xxlarge screens and up.")
								)
							)
						)
					)
				)
			)
		);
	}
});
