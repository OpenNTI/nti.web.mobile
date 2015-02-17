import React from 'react';

import LogoutButton from 'login/components/LogoutButton';

import NavDrawerItem from 'navigation/components/NavDrawerItem';
import Loading from './Loading';
import HomeLink from './HomeLink';

export default React.createClass({
	displayName: 'LeftNav',

	propTypes: {
		items: React.PropTypes.array.isRequired
	},


	getDefaultProps () {
		return {
			items: [],
			isLoading: false
		};
	},


	componentWillMount () {
		this.setState({ index: this.props.items.length - 1 });
	},


	componentWillReceiveProps (nextProps) {
		if(nextProps.items !== this.props.items) {
			this.setState({index: nextProps.items.length - 1});
		}
	},


	render () {

		var record = this.props.items[this.state.index];

		return (
			<div>
				<ul className="off-canvas-list">
					<li><HomeLink /></li>
					{this.props.isLoading ?
						<Loading /> :
						(record ?
							<NavDrawerItem record={record}/> :
								null)
					}
				</ul>
				<div className="text-center logout"><LogoutButton /></div>
			</div>
		);
	}
});
