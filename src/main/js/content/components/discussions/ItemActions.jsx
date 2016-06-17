import React from 'react';

import {Mixins} from 'nti-web-commons';
import {getService} from 'nti-web-client';

import cx from 'classnames';

import {Prompt} from 'nti-web-commons';

import Action from './ItemAction';

const CLOSE_MENU_DELAY = 30000; //30 seconds

const CanDelete = (_, item) => item.hasLink('edit');
const CanEdit = (_, item) => item.hasLink('edit');
const CanFlag = (_, item) => item.hasLink('flag') || item.hasLink('flag.metoo');
const CanReply = caps => caps && caps.canShare;
const CanShare = (caps, item) =>
					CanEdit(caps, item)
					&& item.isTopLevel
					&& (caps && caps.canShare)
					&& false; //disable for now

export default React.createClass({
	displayName: 'ItemActions',
	mixins: [Mixins.ItemChanges],

	propTypes: {
		item: React.PropTypes.object.isRequired,

		onDelete: React.PropTypes.func,
		onEdit: React.PropTypes.func.isRequired,
		onFlag: React.PropTypes.func,
		onReply: React.PropTypes.func.isRequired//,
		// onShare: React.PropTypes.func.isRequired
	},


	getInitialState () {
		return {};
	},


	componentWillMount () {
		getService().then(s => this.setState({capabilities: s.capabilities}));
	},


	componentDidUpdate () {
		const {list} = this;
		if (list) {
			list.focus();
		}
	},


	hideMenu () {
		clearTimeout(this.state.closeTimer);
		this.setState({
			closeTimer: setTimeout(() => this.setState({moreOptionsOpen: false}), 200)
		});
	},


	toggleMenu () {
		let {moreOptionsOpen} = this.state || {};

		let newState = !moreOptionsOpen;

		this.setState({moreOptionsOpen: newState});

		clearTimeout(this.state.closeTimer);
		if (newState) {
			this.setState({
				closeTimer: setTimeout(()=> this.setState({moreOptionsOpen: false}), CLOSE_MENU_DELAY)
			});
		}
	},


	render () {
		const {props: {item}, state: {moreOptionsOpen, capabilities}} = this;

		const flag = item.hasLink('flag.metoo') ? 'flagged' : 'flag';

		const showMenu = [CanReply, CanShare, CanEdit, CanDelete].some(x => x(capabilities, item));

		return showMenu ? (

				<div className="discussion-item-actions">
					<Action name="reply" criteria={CanReply(capabilities, item)} onClick={this.onReply}/>
					<Action name="share" criteria={CanShare(capabilities, item)} onClick={this.onShare}/>
					<span className={cx('options', {open: moreOptionsOpen})}>
						<Action name="more-options" onClick={this.toggleMenu} iconOnly/>
						<ul ref={x => this.list = x} onBlur={this.hideMenu} tabIndex={moreOptionsOpen ? -1 : 0}>
							<Action name="edit" criteria={CanEdit(capabilities, item)} inList onClick={this.onEdit}/>
							<Action name={flag} criteria={CanFlag(capabilities, item)} inList onClick={this.onFlag}/>
							<Action name="delete" criteria={CanDelete(capabilities, item)} inList onClick={this.onDelete}/>
						</ul>
					</span>
				</div>

			) : (
				<div className="discussion-item-actions">
					<Action className="flag" name={flag} item={item} criteria={CanFlag(capabilities, item)} onClick={this.onFlag}/>
				</div>
			);
	},


	onDelete () {
		const {onDelete, item} = this.props;

		if (onDelete) {
			onDelete(item);
			return;
		}

		item.delete();
	},


	onEdit () {
		const {onEdit, item} = this.props;
		onEdit(item);
	},


	onFlag () {
		const {onFlag, item} = this.props;

		if (onFlag) {
			onFlag(item);
			return;
		}

		Prompt.areYouSure('This action cannot be undone.', 'Report content as inappropriate?')
			.then(
				() => item.flag(),
				()=> {}
				);
	},


	onReply () {
		const {onReply, item} = this.props;
		onReply(item);
	},


	onShare () {
		// const {onShare, item} = this.props;
		// onShare(item);
	}
});
