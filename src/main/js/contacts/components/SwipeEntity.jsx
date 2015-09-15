import React from 'react';
import SwipeToRevealOptions from 'react-swipe-to-reveal-options';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import ProfileLink from 'profile/components/ProfileLink';

import cx from 'classnames';


export default React.createClass({
	displayName: 'SwipeEntity',

	propTypes: {
		entity: React.PropTypes.object.isRequired,
		onChange: React.PropTypes.func,
		selection: React.PropTypes.object.isRequired
	},

	association (entity) {
		let {generalName, displayName, displayType} = entity;
		let type = generalName ? displayName : entity.isUser ? null : displayType;

		return type; // || entity.association;
	},

	render () {

		let {entity, selection} = this.props;
		let selected = selection.isSelected(entity);

		let rightOptions = [
			{
				label: selected ? 'Remove' : 'Undo',
				class: cx('tiny button', {'caution': selected})
			}
		];

		let classes = cx('selectable-entity',
			{
				'selected': selected,
				'unselected': !selected
			}
		);

		return (
			<SwipeToRevealOptions key={entity.getID()}
				rightOptions={rightOptions}
				callActionWhenSwipingFarRight={false}
				className={classes}
				onRightClick={this.props.onChange.bind(null,entity)}
			>
				<ProfileLink entity={entity}>
					<div className="avatar-spacer" entity={entity}>
						<Avatar entity={entity} />
						<DisplayName entity={entity} useGeneralName/>
						<div className="association">{this.association(entity)}</div>
					</div>
				</ProfileLink>
			</SwipeToRevealOptions>
		);
	}
});
