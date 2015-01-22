/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Prompt = require('prompts');

var Actions = require('../Actions');
var t = require('common/locale').scoped('FORUMS');


var ReportLink = React.createClass({

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	_report: function() {
		Prompt.areYouSure('Report this as inappropriate?').then(
			()=> {
				this.setState({
					busy: true
				});
				Actions.reportItem(this.props.item);	
			},
			()=>{}
		);
	},

	render: function() {
		var {item} = this.props;
		var isReported = item.hasLink('flag.metoo');
		var Tag = isReported ? "span" : "a";

		return (
			<Tag onClick={this._report}>{this.props.linkText||t(['reportComment', isReported ? 'again' : 'first'])}</Tag>
		);
	}

});

module.exports = ReportLink;
