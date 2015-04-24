import React from 'react';
import {scoped} from 'common/locale';

const t = scoped('BUTTONS');

export default React.createClass({
	displayName: 'OkCancelButtons',

	propTypes: {
		cancelText: React.PropTypes.string,
		okText: React.PropTypes.string,

		onCancel: React.PropTypes.func,
		onOk: React.PropTypes.func.isRequired,
		okEnabled: React.PropTypes.bool
	},

	getDefaultProps () {
		return {
			okEnabled: true
		};
	},

	onCancel (event) {
		this.killEvent(event);
		this.props.onCancel(event);
	},

	onConfirm (event) {
		this.killEvent(event);
		this.props.onOk(event);
	},

	killEvent (event) {
		event.preventDefault();
		event.stopPropagation();
	},

	render () {

		return (
			<div className="buttons">
				{this.props.onCancel &&
					<a href="#"
						onClick={this.onCancel}
						className="cancel button">{this.props.cancelText || t('cancel')}</a>
				}

				<a href="#"
					onClick={this.props.okEnabled ? this.onConfirm : this.killEvent}
					disabled={!this.props.okEnabled}
					className="confirm button">{this.props.okText || t('ok')}</a>
			</div>
		);
	}

});
