import React from 'react';

import Loader from 'common/components/TinyLoader';
import {default as DisplayName} from 'common/components/DisplayName';
import resolveUser from 'common/utils/resolve-user';
import ensureArray from 'nti.lib.interfaces/utils/ensure-array';

export default React.createClass({
	displayName: 'HeadSummary',

	propTypes: {
		username: React.PropTypes.string.isRequired
	},

	getInitialState () {
		return {
		};
	},

	componentWillMount () {
		this.setUser();
	},

	componentWillReceiveProps (nextProps) {
		this.setUser(nextProps);
	},

	setUser(props=this.props) {
		resolveUser(props).then(user => {
			this.setState({user});
		});
	},

	render () {
		let {user} = this.state;

		if (!user) {
			return <Loader />;
		}

		let ed = ensureArray(user.education);

		return (
			<div className="profile-head-summary">
				<div className="label">
					<DisplayName username={this.props.username}/>
				</div>
				<ul className="profile-head-summary-attrs">
					{ed.map(item => {
						return <li className='education'>{item.degree} at {item.school}</li>;
					})}
					{[
						'affiliation',
						'location',
						'home_page'].map( attr => user[attr] && <li className={attr}>{user[attr]}</li>)
					}
				</ul>
			</div>
		);
	}
});
