import React from 'react';
import cx from 'classnames';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import Loading from 'common/components/TinyLoader';

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
		labels: React.PropTypes.object // e.g. {selected: 'Remove', unselected: 'Undo'}
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
		let labels = this.props.labels || {};
		return selected ? labels.selected : labels.unselected;
	},

	render () {
		let {entity, selected, tag, removable, labels} = this.props;
		let {busy} = this.state;
		let classes = cx({
			'select-button': !labels,
			'state-label': labels,
			'selected': selected,
			'busy': busy,
			'removable': removable
		});
		let wrapperClasses = cx('selectable-entity', {
			'selected': selected,
			'unselected': !selected
		});
		let Element = tag;

		// labels: {
		// 	selected: 'Remove'
		// 	unselected: 'Undo'
		// }

		return (
			<Element className={wrapperClasses} {...this.props} onClick={this.onClick}>
				<div>
					<Avatar entity={entity} />
					<DisplayName entity={entity} />
					<div className="association"></div>
				</div>
				<div className={classes}>{this.label(selected)}</div>
				{busy && <Loading />}
				{this.props.children}
			</Element>
		);
	}
});
