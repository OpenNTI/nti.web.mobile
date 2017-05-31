import PropTypes from 'prop-types';
import React from 'react';
import SwipeToRevealOptions from 'react-swipe-to-reveal-options';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import ProfileLink from 'profile/components/ProfileLink';

import cx from 'classnames';


export default class extends React.Component {
	static displayName = 'SwipeEntity';

	static propTypes = {
		entity: PropTypes.object.isRequired,
		onChange: PropTypes.func,
		selection: PropTypes.object.isRequired
	};

	association = (entity) => {
		let {generalName, displayName, displayType} = entity;
		let type = generalName ? displayName : entity.isUser ? null : displayType;

		return type; // || entity.association;
	};

	onChange = () => {
		let {entity} = this.props;
		this.props.onChange(entity);
	};

	render () {

		let {entity, selection} = this.props;
		let selected = selection.isSelected(entity);

		const rightOptions = [];
		//no user will be "modifiable" by another... so...
		if(/*entity.isModifiable*/ entity) {
			rightOptions.push({
				label: selected ? 'Remove' : 'Undo',
				class: cx('tiny button', {'caution': selected})
			});
		}

		const classes = cx('selectable-entity', { selected, 'unselected': !selected});

		return (
			<SwipeToRevealOptions key={entity.getID()}
				rightOptions={rightOptions}
				callActionWhenSwipingFarRight={false}
				className={classes}
				onRightClick={this.onChange}
			>
				<ProfileLink entity={entity}>
					<div className="avatar-spacer" entity={entity}>
						<Avatar entity={entity} suppressProfileLink/>
						<DisplayName entity={entity} useGeneralName suppressProfileLink/>
						<div className="association">{this.association(entity)}</div>
					</div>
				</ProfileLink>
			</SwipeToRevealOptions>
		);
	}
}
