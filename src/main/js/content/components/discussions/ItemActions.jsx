import React from 'react';

import ItemChanges from 'common/mixins/ItemChanges';
import {getService} from 'common/utils';

import cx from 'classnames';

import {areYouSure} from 'prompts';

import Action from './ItemAction';

const CLOSE_MENU_DELAY = 30000; //30 seconds

const CanReply = caps => caps && caps.canShare;
const CanShare = () => false; //implement
const CanEdit = () => false; //implement
const CanFlag = (_, item) => item.hasLink('flag') || item.hasLink('flag.metoo');
const CanDelete = () => false; //implement

export default React.createClass({
	displayName: 'ItemActions',
	mixins: [ItemChanges],

	propTypes: {
		item: React.PropTypes.object,

		onReply: React.PropTypes.func.isRequired
	},


	componentWillMount () {
		getService().then(s => this.setState({capabilities: s.capabilities}));
	},


	hideMenu () {
		clearTimeout(this.state.closeTimer);
		this.state.closeTimer = setTimeout(() => this.setState({moreOptionsOpen: false}), 200);
	},


	toggleMenu (e) {
		e.preventDefault();
		e.stopPropagation();

		let {moreOptionsOpen} = this.state || {};

		let newState = !moreOptionsOpen;

		this.setState({moreOptionsOpen: newState});

		clearTimeout(this.state.closeTimer);
		if (newState) {
			this.state.closeTimer = setTimeout(()=> this.setState({moreOptionsOpen: false}), CLOSE_MENU_DELAY);
		}
	},


	componentDidUpdate () {
		const {refs: {list}} = this;
		if (list) {
			list.focus();
		}
	},


	render () {
		let {item} = this.props;
		let {moreOptionsOpen, capabilities} = this.state || {};

		let flag = item.hasLink('flag.metoo') ? 'flagged' : 'flag';

		let showMenu = [CanReply, CanShare, CanEdit, CanDelete].some(x => x(capabilities, item));

		return showMenu ? (

				<div className="discussion-item-actions">
					<Action name="reply" item={item} criteria={CanReply(capabilities, item)} onClick={this.onReply}/>
					<Action name="share" item={item} criteria={CanShare(capabilities, item)}/>
					<span className={cx('options', {open: moreOptionsOpen})}>
						<a className="action more-options" href="#" onClick={this.toggleMenu}/>
						<ul ref="list" onBlur={this.hideMenu} tabIndex={moreOptionsOpen ? -1 : 0}>
							<Action name="edit" item={item} criteria={CanEdit(capabilities, item)} inList/>
							<Action name={flag} item={item} criteria={CanFlag(capabilities, item)} inList onClick={this.onFlag}/>
							<Action name="delete" item={item} criteria={CanDelete(capabilities, item)} inList/>
						</ul>
					</span>
				</div>

			) : (
				<div className="discussion-item-actions">
					<Action className="flag" name={flag} item={item} criteria={CanFlag(capabilities, item)} onClick={this.onFlag}/>
				</div>
			);
	},


	onFlag () {
		areYouSure('This action cannot be undone.', 'Report content as inappropriate?')
			.then(
				() => this.props.item.flag(),
				()=> {}
				);
	},


	onReply () {
		this.props.onReply();
	}
});
