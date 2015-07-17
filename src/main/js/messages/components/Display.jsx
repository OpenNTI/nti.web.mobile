

import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import Store from '../Store';
import * as MessageActions from '../Actions';

import Alert from './Alert';


const dismiss = 'Display:dismiss';
const getMessages = 'Display:getMessages';
const updateMessages = 'Display:updateMessages';


export default React.createClass({

	displayName: 'messages:Display',

	propTypes: {
		category: React.PropTypes.string
	},

	[updateMessages] () {
		if (this.isMounted()) {
			let options = this.props.category ? {category: this.props.category} : null;
			this.setState({messages: Store.messages(options)});
		}
		//else {
			// how can this be?
			// JSG: This can be if the bound reference was given to an asyncronous function
			// 		as a callback, and it calls back after we've already dismissed.
		//}
	},

	componentWillMount () {
		Store.addChangeListener(this[updateMessages]);
		this[getMessages]();
	},

	componentWillReceiveProps () {
		this[getMessages]();
	},

	componentDidUnmount () {
		Store.removeChangeListener(this[updateMessages]);
	},

	[getMessages] () {
		let options = this.props.category ? {category: this.props.category} : null;
		this.setState({
			messages: Store.messages(options)
		});
	},

	[dismiss] (component) {
		MessageActions.removeMessage(component.props.message.id);
	},

	render () {
		if (this.state.messages.length === 0) {
			return (<div />);
		}
		let dis = this[dismiss];
		let msgs = this.state.messages.map(e => (
			<Alert key={'m' + e.id} message={e} dismiss={dis} />
		));

		return (
			<ReactCSSTransitionGroup transitionName="messages">{msgs}</ReactCSSTransitionGroup>
		);
	}

});
