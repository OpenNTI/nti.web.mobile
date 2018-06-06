import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Mixins, Prompt, Flyout} from '@nti/web-commons';
import {getService} from '@nti/web-client';

import Action from './ItemAction';


const CanDelete = (_, item) => item.isModifiable;
const CanEdit = (_, item) => item.isModifiable;
const CanFlag = (_, item) => item.hasLink('flag') || item.hasLink('flag.metoo');
const CanReply = caps => caps && caps.canShare;
const CanShare = (caps, item) =>
	CanEdit(caps, item)
					&& item.isTopLevel
					&& (caps && caps.canShare)
					&& false; //disable for now

export default createReactClass({
	displayName: 'ItemActions',
	mixins: [Mixins.ItemChanges],

	propTypes: {
		item: PropTypes.object.isRequired,

		onDelete: PropTypes.func,
		onEdit: PropTypes.func.isRequired,
		onFlag: PropTypes.func,
		onReply: PropTypes.func.isRequired//,
		// onShare: React.PropTypes.func.isRequired
	},


	getInitialState () {
		return {};
	},


	attachListRef (x) { this.flyout = x; },


	componentWillMount () {
		getService().then(s => this.setState({capabilities: s.capabilities}));
	},


	renderTrigger () {
		return <Action name="more-options" iconOnly/>;
	},


	render () {
		const {props: {item}, state: {capabilities}} = this;

		const flag = item.hasLink('flag.metoo') ? 'flagged' : 'flag';

		const showMenu = [CanReply, CanShare, CanEdit, CanDelete].some(x => x(capabilities, item));

		return showMenu ? (

			<div className="discussion-item-actions">
				<Action name="reply" criteria={CanReply(capabilities, item)} onClick={this.onReply}/>
				<Action name="share" criteria={CanShare(capabilities, item)} onClick={this.onShare}/>
				<Flyout.Triggered
					className="discussion-item-action-flyout"
					trigger={this.renderTrigger()}
					ref={this.attachListRef}
					horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				>
					<ul className="discussion-item-actions-options">
						<Action name="edit" criteria={CanEdit(capabilities, item)} inList onClick={this.onEdit}/>
						<Action name={flag} criteria={CanFlag(capabilities, item)} inList onClick={this.onFlag}/>
						<Action name="delete" criteria={CanDelete(capabilities, item)} inList onClick={this.onDelete}/>
					</ul>
				</Flyout.Triggered>
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
