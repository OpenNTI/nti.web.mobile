import React from 'react';
import emptyFunction from 'react/lib/emptyFunction';

function dismiss(dialog) {
	dialog.props.onDismiss.call();
	dialog.props.onDismiss = emptyFunction;//don't double call

	dialog.setState({dismissing: true});

	//Wait for animation before we remove it.
	setTimeout(
		()=>{
			if (!exports.clear() && dialog.isMounted()) {
				console.warn('React did not unmount %o', dialog);
			}
		},
		500//animation delay (0.5s)
	);
}


export default React.createClass({
	displayName: 'Dialog',

	statics: {
		active: null,

		getMountPoint () {
			return document.getElementById('modals');
		},

		clear () {
			let res = React.unmountComponentAtNode(this.getMountPoint());
			if (res) {//only clear active if React unmounted the component at the mount point.
				this.active = null;
			}
			return res;
		},

		show (props) {
			if (this.active) {
				this.active.dismiss();
			}


			this.active = React.render(
				React.createElement(exports, props),
				this.getMountPoint());

		}
	},

	propTypes: {
		iconClass: React.PropTypes.string,
		title: React.PropTypes.string,
		message: React.PropTypes.string,

		confirmButtonLabel: React.PropTypes.string,
		confirmButtonClass: React.PropTypes.string,

		cancelButtonLabel: React.PropTypes.string,
		cancelButtonClass: React.PropTypes.string,



		onCancel: React.PropTypes.func,
		onConfirm: React.PropTypes.func,
		onDismiss: React.PropTypes.func
	},

	getInitialState () {
		return {
			dismissing: false
		};
	},

	getDefaultProps () {
		return {
			iconClass: 'alert',
			message: '...',
			confirmButtonClass: '',
			cancelButtonClass: '',
			onCancel: emptyFunction,
			onConfirm: emptyFunction,
			onDismiss: emptyFunction
		};
	},


	componentDidMount () {
		window.addEventListener('popstate', this.dismiss);
	},

	componentWillUnmount () {
		window.removeEventListener('popstate', this.dismiss);
	},


	handleEscapeKey (e) {
		if (e.key === 'Escape') {
			this.dismiss();
		}
	},


	confirmClicked (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		dismiss(this);
		this.props.onConfirm.call();
	},

	dismiss (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		dismiss(this);
		this.props.onCancel.call();
	},


	componentDidUpdate () {
		let focusNode;
		if (this.isMounted()) {
			focusNode = this.refs.confirm || this.refs.cancel || this;

			focusNode.getDOMNode().focus();
		}
	},


	render () {
		let {title, message, iconClass} = this.props;

		let state = 'showing';
		if (this.state.dismissing) {
			state = 'dismissing';
		}

		title = title || 'Alert'; //TODO: localize the default

		return (
			<div className={`modal dialog mask ${state}`} onKeyDown={this.handleEscapeKey}>

				<div className={`dialog window ${state}`}>
					{this.renderDismissControl()}
					<div className={`icon ${iconClass}`}/>
					<div className="content-area">
						<h1>{title}</h1>
						<p>{message}</p>
					</div>
					<div className="buttons">
						{this.renderCancelButton()}
						{this.renderConfirmButton()}
					</div>
				</div>

			</div>
		);
	},


	renderCancelButton () {
		let {onCancel, cancelButtonLabel, cancelButtonClass} = this.props;

		cancelButtonLabel = cancelButtonLabel || 'Cancel';//TODO: localize the default

		if (onCancel == null) {
			return null;
		}

		return (
			<a ref="cancel" className={`cancel button ${cancelButtonClass}`} href="#cancel" onClick={this.dismiss}>
				{cancelButtonLabel}
			</a>
		);
	},


	renderConfirmButton () {
		let {onConfirm, confirmButtonLabel, confirmButtonClass} = this.props;

		confirmButtonLabel = confirmButtonLabel || 'OK';//TODO: localize the default
		confirmButtonClass = confirmButtonClass || 'primary';

		if (onConfirm == null) {
			return null;
		}

		return (
			<a ref="confirm" className={`confirm button ${confirmButtonClass}`} href="#confirm" onClick={this.confirmClicked}>
				{confirmButtonLabel}
			</a>
		);
	},


	renderDismissControl () {
		if (this.props.onCancel == null) {
			return null;
		}

		return (
			<a className="close" href="#dismiss" onClick={this.dismiss}>x</a>
		);
	}

});
