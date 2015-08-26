import React from 'react';
import cx from 'classnames';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import Loading from 'common/components/TinyLoader';
import ProfileLink from 'profile/components/ProfileLink';

const noclick = Promise.resolve();

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
		this.setState({
			busy: true
		});
		let {onChange, entity} = this.props;
		let p = onChange && onChange(entity) || noclick;
		p.then(() => {
			if (this.isMounted() ) {
				this.setState({
					busy: false
				});
			}
		});
		p.catch(reason => {
			console.error(reason);
			if (this.isMounted()) {
				this.setState({
					busy: false,
					error: reason
				});
			}
		});
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
		const {props: {children, entity, selected, tag, removable, labels, linkToProfile}, state: {busy}} = this;

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
			<Element className={wrapperClasses} {...this.props} onClick={this.onClick}>
				<Tag className="avatar-spacer" entity={entity}>
					<Avatar entity={entity} />
					<DisplayName entity={entity} useGeneralName/>
					<div className="association">{this.association(entity)}</div>
				</Tag>
				<div className={classes}>{this.label(selected)}</div>
				{busy && <Loading />}
				{children}
			</Element>
		);
	}
});
