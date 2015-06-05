import React from 'react';

import cx from 'classnames';

import ItemChanges from '../mixins/ItemChanges';

export default React.createClass({
	displayName: 'Bookmark',
	mixins: [ItemChanges],

	propTypes: {
		item: React.PropTypes.object.isRequired
	},


	onClick (e) {
		e.preventDefault();
		e.stopPropagation();

		let {item} = this.props;

		this.setState({loading: true});
		item.favorite()
			.then(()=> this.setState({loading: false}));
	},


	render () {
		let {item} = this.props;

		let cls = cx('bookmark', {
			active: item.hasLink('unfavorite')
		});

		return (
			<a className={cls} href="#" onClick={this.onClick}/>
		);
	}
});
