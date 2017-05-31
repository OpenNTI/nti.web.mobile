import React from 'react';
import cx from 'classnames';

import SwipeToRevealOptions from 'react-swipe-to-reveal-options';

import AvatarProfileLink from 'profile/components/AvatarProfileLink';

import ListMeta from './ListMeta';

export default class extends React.Component {
    static displayName = 'GroupsListItem';

    static propTypes = {
		item: React.PropTypes.object.isRequired,
		onRightClick: React.PropTypes.func
	};

    onRightClick = () => {
		const {item, onRightClick} = this.props;
		onRightClick && onRightClick(item);
	};

    render() {

		const {item} = this.props;

		const rightOptions = [];
		if(item.isModifiable) {
			rightOptions.push({
				label: 'Delete',
				class: cx('tiny button caution', {
					'disabled': !(item.delete && (!item.friends || item.friends.length === 0))
				})
			});
		}

		return (
			<li className="has-swipe-controls" key={item.getID()}>
				<SwipeToRevealOptions
					rightOptions={rightOptions}
					callActionWhenSwipingFarRight={false}
					onRightClick={this.onRightClick}
				>
					<AvatarProfileLink entity={item}>
						<ListMeta entity={item} />
					</AvatarProfileLink>
					{/*{item.delete && (!item.friends || item.friends.length === 0) && (
						<div className="delete" onClick={this.deleteGroup.bind(this, item)}/>
					)}*/}
				</SwipeToRevealOptions>
			</li>
		);
	}
}
