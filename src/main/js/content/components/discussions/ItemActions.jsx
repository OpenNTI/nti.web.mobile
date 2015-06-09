import React from 'react';

import ItemChanges from 'common/mixins/ItemChanges';

import cx from 'classnames';

import {areYouSure} from 'prompts';

import Action from './ItemAction';

const CanReply = () => false; //implement
const CanShare = () => false; //implement
const CanEdit = () => false; //implement
const CanFlag = item => item.hasLink('flag') || item.hasLink('flag.metoo');
const CanDelete = () => false; //implement

export default React.createClass({
	displayName: 'ItemActions',
	mixins: [ItemChanges],

	propTypes: {
		item: React.PropTypes.object
	},


	toggleMenu (e) {
		e.preventDefault();
		e.stopPropagation();

		let {moreOptionsOpen} = this.state || {};

		this.setState({moreOptionsOpen: !moreOptionsOpen});
	},


	render () {
		let {item} = this.props;
		let {moreOptionsOpen} = this.state || {};

		let flag = item.hasLink('flag.metoo') ? 'flagged' : 'flag';

		let showMenu = [CanReply, CanShare, CanEdit, CanDelete].some(x => x(item));

		return showMenu ? (

				<div className="discussion-item-actions">
					<Action name="reply" item={item} criteria={CanReply}/>
					<Action name="share" item={item} criteria={CanShare}/>
					<span className={cx('options', {open: moreOptionsOpen})}>
						<a className="action more-options" href="#" onClick={this.toggleMenu}/>
						<ul>
							<Action name="edit" item={item} criteria={CanEdit} inList/>
							<Action name={flag} item={item} criteria={CanFlag} inList onClick={this.onFlag}/>
							<Action name="delete" item={item} criteria={CanDelete} inList/>
						</ul>
					</span>
				</div>

			) : (
				<div className="discussion-item-actions">
					<Action className="flag" name={flag} item={item} criteria={CanFlag} onClick={this.onFlag}/>
				</div>
			);
	},


	onFlag () {
		this.setState({moreOptionsOpen: false});
		areYouSure('This action cannot be undone.', 'Report content as inappropriate?')
			.then(
				() => this.props.item.flag(),
				()=> {}
				);
	}
});
