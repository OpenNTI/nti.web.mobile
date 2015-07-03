import React from 'react';
import Mixin from './Mixin';
import selectWidget from './';
import Card from '../Card';

export default React.createClass({
	displayName: 'MembershipList',

	propTypes: {
		list: React.PropTypes.array.isRequired,
		title: React.PropTypes.string
	},

	mixins: [Mixin],

	render () {

		let {list} = this.props;

		return (
			<Card title={this.props.title}>
				<ul>
					{list.map((item, index) => selectWidget(item, index))}
				</ul>
			</Card>
		);
	}
});
