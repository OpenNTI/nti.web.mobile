/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Video = require('common/components/Video');

module.exports = React.createClass({
	displayName: 'CourseOverviewVideo',

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.ntivideo/i,
		handles: function(item) {
			return this.mimeTest.test(item.MimeType);
		}
	},

	render: function() {
		var item = this.props.item;
		var style = {
			backgroundImage: 'url(' + item.poster + ')'
		};

		return (
			<li tabIndex="0" onFocus={this.props.onFocus} style={style} className="video flex-video widescreen">
				<div className="wrapper">
					<a className="label" title={item.label}>{item.label}</a>
					<div className="buttons">
						<a className="play" data-qtip="Play"/>
						<a className="player" data-qtip="Play"/>
					</div>
				</div>
			</li>
		);
	}
});
