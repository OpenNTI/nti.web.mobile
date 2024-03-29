import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Avatar from 'internal/common/components/Avatar';
import DisplayName from 'internal/common/components/DisplayName';
import SwipeToRevealOptions from 'internal/common/components/SwipeToRevealOptions';

import ListMeta from './ListMeta';

export default class extends React.Component {
	static displayName = 'DistributionListItem';

	static propTypes = {
		item: PropTypes.object.isRequired,
		onRightClick: PropTypes.func,
	};

	onRightClick = e => {
		const { item, onRightClick } = this.props;
		onRightClick && onRightClick(item, e);
	};

	render() {
		const { item } = this.props;

		const rightOptions = [];
		if (item.isModifiable) {
			rightOptions.push({
				label: 'Delete',
				class: cx('tiny button caution', {
					disabled: !item.delete,
				}),
			});
		}

		return (
			<li className="has-swipe-controls">
				<SwipeToRevealOptions
					rightOptions={rightOptions}
					callActionWhenSwipingFarRight={false}
					onRightClick={this.onRightClick}
				>
					<a href={encodeURIComponent(item.getID())}>
						<Avatar entity={item} suppressProfileLink />
						<div className="body">
							<DisplayName entity={item} suppressProfileLink />
							<ListMeta entity={item} />
							{/*{item.delete && <div className="delete" onClick={this.deleteList.bind(this, item)}></div>}*/}
						</div>
					</a>
				</SwipeToRevealOptions>
			</li>
		);
	}
}
