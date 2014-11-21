/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var _t = require('common/locale').scoped("ENROLLMENT.CONFIRMATION");

module.exports = React.createClass({
	displayName: 'GiftInfo',

	render: function() {
		var info = this.props.info;

		if (!info || !info.from) {
			return (<div/>)
		}

		return (
			<fieldset>
				<div className="title">
					<span>{_t("giftInfo")}</span>
					<a href={this.props.edit}>edit</a>
				</div>
				<div>
					<span className="label">{_t("from")}</span>
					<span className="value">{info.sender ? info.sender + '(' + info.from + ')' : info.from}</span>
				</div>
				{!info.receiver ? '' :
					<div>
						<span className="label">{_t("to")}</span>
						<span className="value">{info.to ? info.to + '(' + info.receiver + ')' : info.receiver}</span>
					</div>
				}
				{!info.message ? '' :
					<div>
						<span className="label">{_t("message")}</span>
						<span className="value">{info.message}</span>
					</div>
				}
			</fieldset>
		);
	}
});
