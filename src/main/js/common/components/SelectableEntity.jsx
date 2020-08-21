import './SelectableEntity.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Loading} from '@nti/web-commons';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import ProfileLink from 'profile/components/ProfileLink';

export default class SelectableEntity extends React.Component {

	static propTypes = {
		entity: PropTypes.object.isRequired,
		selected: PropTypes.bool,
		tag: PropTypes.string,
		onChange: PropTypes.func,
		removable: PropTypes.bool,
		children: PropTypes.any,
		labels: PropTypes.object, // e.g. {selected: 'Remove', unselected: 'Undo'}
		linkToProfile: PropTypes.any
	}

	static defaultProps = {
		tag: 'li',
		removable: false
	}

	state = {
		busy: false
	}

	onClick = () => {
		this.setState({ busy: true });

		const {onChange, entity} = this.props;

		Promise.resolve(onChange && onChange(entity))
			.catch(error => this.setState({ error }))
			.then(() => this.setState({ busy: false }));
	}

	label = (selected) => {
		let {labels = {}} = this.props;
		return selected ? labels.selected : labels.unselected;
	}

	association = (entity) => {
		let {generalName, displayName, displayType} = entity;
		let type = generalName ? displayName : entity.isUser ? null : displayType;

		return type; // || entity.association;
	}

	render () {
		const {props: {children, entity, selected, tag, removable, labels, linkToProfile, ...props}, state: {busy}} = this;

		let profileLinks = linkToProfile !== undefined;

		let classes = cx({
			'select-button': !labels,
			'state-label': labels,
			'selected': selected,
			'busy': busy,
			'removable': removable
		});
		let wrapperClasses = cx('selectable-entity', {
			'selected': selected,
			'unselected': !selected,
			'profile-linked': profileLinks
		});
		let Element = tag;

		// labels: {
		// 	selected: 'Remove'
		// 	unselected: 'Undo'
		// }

		let Tag = profileLinks ? ProfileLink : 'div';

		return (
			<Element className={wrapperClasses} {...props} onClick={profileLinks ? null : this.onClick}>
				<Tag className="avatar-spacer" entity={entity}>
					<Avatar entity={entity} suppressProfileLink/>
					<DisplayName entity={entity} useGeneralName suppressProfileLink/>
					<div className="association">{this.association(entity)}</div>
				</Tag>
				<div onClick={profileLinks ? this.onClick : null} className={classes}>{this.label(selected)}</div>
				{busy && <Loading.Ellipse />}
				{children}
			</Element>
		);
	}
}
