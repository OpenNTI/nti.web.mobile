'use strict';

var React = require('react');
var Prompt = require('prompts');

var Actions = require('../Actions');


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
		var classNames = ['fi-flag'];
		if (isReported) {
			classNames.push('flagged');
		}

		return (
			<Tag className={classNames.join(' ')} onClick={this._report}></Tag>
		);
	}

});

module.exports = ReportLink;
