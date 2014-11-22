/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var Actions = require('../Actions');

var _t = require('common/locale').scoped("ENROLLMENT.CONFIRMATION");

module.exports = React.createClass({
	displayName: 'GiftInfo',


	onEdit: function (e) {
		e.preventDefault();
		e.stopPropagation();
		Actions.edit(this.props.edit);
	},


	render: function() {
		var info = this.props.info;

		if (!info || !info.from) {
			return (<div/>);
		}

		return (
			<fieldset>
				<div className="title">
					<span>{_t("giftInfo")}</span> <a href="#" onClick={this.onEdit}>edit</a>
				</div>
				<div className="field">
					<span className="label">{_t("from")}</span>	<span className="value">
						{info.sender ? info.sender + '(' + info.from + ')' : info.from}</span>
				</div>
				{!info.receiver ? '' :
					<div className="field">
						<span className="label">{_t("to")}</span> <span className="value">
							{info.to ? info.to + '(' + info.receiver + ')' : info.receiver}</span>
					</div>
				}
				{!info.message ? '' :
					<div className="field">
						<span className="label">{_t("message")}</span>
						<span className="value">{info.message}</span>
					</div>
				}
			</fieldset>
		);
	}
});
