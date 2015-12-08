import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import {areYouSure} from 'prompts';

import {resetAssignment, excuseGrade} from '../../GradebookActions';

const ACTIONS = [
	{
		label: 'Reset Assignment',
		handler: 'resetAssignment'
	},
	{
		label: 'Excuse Grade',
		handler: excuseGrade
	}
];

export default React.createClass({
	displayName: 'instructor:ActionsMenu',

	propTypes: {
		assignmentId: React.PropTypes.string.isRequired,
		userId: React.PropTypes.string.isRequired
	},

	getInitialState () {
		return {
			open: false
		};
	},

	resetAssignment () {
		areYouSure('Reset this assignment?')
			.then(() => resetAssignment());
	},

	toggleMenu () {
		this.setState({
			open: !this.state.open
		});
	},

	closeMenu () {
		this.setState({
			open: false
		});
	},

	performAction (action) {
		this.closeMenu();
		if (typeof this[action.handler] === 'function') {
			this[action.handler]();
		}
		else if (typeof action.handler === 'function') {
			action.handler(this.props.assignmentId, this.props.userId);
		}
		else {
			console.warn('Unable to execute action %O', action);
		}
	},

	render () {

		const {open} = this.state;
		const classes = cx(
			'gradebook-actions-menu',
			{
				open
			}
		);

		return (
			<div onClick={this.toggleMenu} className={classes}>
				{open &&
					<ul>
						{ACTIONS.map(action => <li key={action.label} onClick={this.performAction.bind(this, action)}>{action.label}</li>)}
					</ul>
				}
			</div>
		);
	}
});
