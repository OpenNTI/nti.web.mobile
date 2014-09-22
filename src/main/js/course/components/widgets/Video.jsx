/** @jsx React.DOM */
'use strict';

var path = require('path');
var React = require('react/addons');
var Video = require('common/components/Video');

module.exports = React.createClass({
	displayName: 'CourseOverviewVideo',

	propTypes: {
		item: React.PropTypes.object.isRequired,
		course: React.PropTypes.object.isRequired,
		basePath: React.PropTypes.string.isRequired
	},

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.ntivideo/i,
		handles: function(item) {
			return this.mimeTest.test(item.MimeType);
		}
	},


	onPlayClicked: function(e) {
		e.preventDefault();
		e.stopPropagation();

		alert('Play');
	},


	render: function() {
		var props = this.props;
		var item = props.item;
		var style = {
			backgroundImage: 'url(' + item.poster + ')'
		};

		var link = path.join(props.basePath, 'course', props.course.getID(), 'v', item.NTIID);

		return (
			<li tabIndex="0" onFocus={this.props.onFocus} style={style} className="video flex-video widescreen">
				<div className="wrapper">
					<a className="label" title={item.label} href={link}>{item.label}</a>
					<div className="buttons">
						<a className="play" data-qtip="Play" href="#play" onClick={this.onPlayClicked}/>
						<a className="player" data-qtip="Play" href={link}/>
					</div>
				</div>
			</li>
		);
	}
});
