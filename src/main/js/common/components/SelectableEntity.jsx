import React from 'react';
import cx from 'classnames';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import {Loading} from 'nti-web-commons';
import ProfileLink from 'profile/components/ProfileLink';

export default React.createClass({
	displayName: 'SelectableEntity',

	propTypes: {
		entity: React.PropTypes.object.isRequired,
		selected: React.PropTypes.bool,
		tag: React.PropTypes.string,
		onChange: React.PropTypes.func,
		removable: React.PropTypes.bool,
		children: React.PropTypes.any,
		labels: React.PropTypes.object, // e.g. {selected: 'Remove', unselected: 'Undo'}
		linkToProfile: React.PropTypes.any
	},

	getDefaultProps () {
		return {
			tag: 'li',
			removable: false
		};
	},

	getInitialState () {
		return {
			busy: false
		};
	},

	onClick () {
		this.setState({ busy: true });

		const {onChange, entity} = this.props;

		Promise.resolve(onChange && onChange(entity))
			.catch(error => this.setState({ error }))
			.then(() => this.setState({ busy: false }));
	},

	label (selected) {
		let {labels = {}} = this.props;
		return selected ? labels.selected : labels.unselected;
	},

	association (entity) {
		let {generalName, displayName, displayType} = entity;
		let type = generalName ? displayName : entity.isUser ? null : displayType;

		return type; // || entity.association;
	},


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
});
