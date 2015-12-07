import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import {areYouSure} from 'prompts';

import {resetAssignment, excuseGrade} from '../../../GradebookActions';

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
	displayName: 'GradebookColumnActions',

	statics: {
		label () {
			return '';
		},
		className: 'col-actions',
		sort: ''
	},

	propTypes: {
		item: React.PropTypes.object.isRequired // UserGradeBookSummary object
	},

	getInitialState () {
		return {
			open: false
		};
	},

	componentDidMount () {
		document.body.addEventListener('click', this.bodyClick);
	},

	componentWillUnmount () {
		document.body.removeEventListener('click', this.bodyClick);
	},

	bodyClick (event) {
		if(!this.state.open) {
			return;
		}
		let {target} = event;
		const node = ReactDOM.findDOMNode(this);

		// ignore if the click is inside the menu
		while(target) {
			if(target === node) {
				return;
			}
			target = target.parentElement;
		}
		this.closeMenu();
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
			action.handler(this.props.item);
		}
		else {
			console.warn('Unable to execute action %O', action);
		}
	},

	render () {

		const {item} = this.props;
		if(!item.HistoryItemSummary || !item.HistoryItemSummary.grade) {
			return null;
		}

		const {open} = this.state;
		const classes = cx(
			'actions-menu',
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
