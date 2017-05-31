import React from 'react';

import SwipeToRevealOptions from 'react-swipe-to-reveal-options';
import cx from 'classnames';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import ListMeta from './ListMeta';

export default class extends React.Component {
    static displayName = 'DistributionListItem';

    static propTypes = {
		item: React.PropTypes.object.isRequired,
		onRightClick: React.PropTypes.func
	};

    onRightClick = (e) => {
		const {item, onRightClick} = this.props;
		onRightClick && onRightClick(item, e);
	};

    render() {

		const {item} = this.props;

		const rightOptions = [];
		if(item.isModifiable) {
			rightOptions.push({
				label: 'Delete',
				class: cx('tiny button caution', {
					'disabled': !item.delete
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
					<a href={encodeURIComponent(item.getID())}>
						<Avatar entity={item} suppressProfileLink/>
						<div className="body">
							<DisplayName entity={item} suppressProfileLink/>
							<ListMeta entity={item} />
							{/*{item.delete && <div className="delete" onClick={this.deleteList.bind(this, item)}></div>}*/}
						</div>
					</a>
				</SwipeToRevealOptions>
			</li>
		);
	}
}
