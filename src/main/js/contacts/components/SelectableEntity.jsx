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
		onChange: React.PropTypes.func
	},

	getDefaultProps () {
		return {
			tag: 'li'
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
		p.then(this.setState({
			busy: false
		}));
	},

	render () {
		let {entity, selected, tag} = this.props;
		let {busy} = this.state;
		let classes = cx('selectable-entity', {
			'selected': selected,
			'busy': busy
		});
		let Element = tag;
		return (
			<Element className={classes} onClick={this.onClick} {...this.props}>
				<div>
					<Avatar entity={entity} />
					<DisplayName entity={entity} />
					<div className="association"></div>
				</div>
			</Element>
		);
	}
});
