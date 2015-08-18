import React from 'react';
import cx from 'classnames';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

const noclick = Promise.resolve();

export default React.createClass({
	displayName: 'SelectableEntity',

	propTypes: {
		entity: React.PropTypes.object.isRequired,
		selected: React.PropTypes.bool,
		tag: React.PropTypes.string,
		onChange: React.PropTypes.func,
		removable: React.PropTypes.bool,
		children: React.PropTypes.any
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

	render () {
		let {entity, selected, tag, removable} = this.props;
		let {busy} = this.state;
		let classes = cx('select-button',{
			'selected': selected,
			'busy': busy,
			'removable': removable
		});
		let Element = tag;
		return (
			<Element className='selectable-entity' {...this.props} onClick={this.onClick}>
				<div>
					<Avatar entity={entity} />
					<DisplayName entity={entity} />
					<div className="association"></div>
				</div>
				<div className={classes}></div>
				{this.props.children}
			</Element>
		);
	}
});
