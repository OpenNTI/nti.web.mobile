import React from 'react';
import PropTypes from 'prop-types';
import {HOC} from '@nti/lib-commons';

export class Provider extends React.Component {
	static connect (component) {
		class cmp extends React.Component {
			render () {
				return (
					<Provider _component={component} {...this.props}/>
				);
			}
		}

		return HOC.hoistStatics(cmp, component, 'ShowAvatarProvider');
	}


	static propTypes = {
		_component: PropTypes.any,
		children: PropTypes.any,
	}


	static childContextTypes = {
		showAvatars: PropTypes.bool,
		setShowAvatars: PropTypes.func
	}


	state = {
		showAvatars: true
	}


	getChildContext () {
		return {
			showAvatars: this.state.showAvatars,
			setShowAvatars: (bool) => this.setState({showAvatars: bool})
		};
	}


	render () {
		const {children, _component, ...props} = this.props;

		return _component
			? React.createElement(_component, props, children)
			: React.cloneElement(React.Children.only(children), props);
	}
}


export class Receiver extends React.Component {
	static connect (component) {
		class cmp extends React.Component {
			render () {
				return (
					<Receiver _component={component} {...this.props}/>
				);
			}
		}

		return HOC.hoistStatics(cmp, component, 'ShowAvatarReceiver');
	}


	static propTypes = {
		_component: PropTypes.any,
		children: PropTypes.any
	}

	static contextTypes = {
		showAvatars: PropTypes.bool,
		setShowAvatars: PropTypes.func
	}

	render () {
		const {children, _component, ...props} = this.props;

		Object.assign(props, this.context);

		return _component
			? React.createElement(_component, props, children)
			: React.cloneElement(React.Children.only(children), props);
	}
}
