import React from 'react';

import Loader from 'common/components/TinyLoader';
import {default as DisplayName} from 'common/components/DisplayName';
import resolveUser from 'common/utils/resolve-user';

export default React.createClass({
	displayName: 'HeadSummary',

	propTypes: {
		username: React.PropTypes.string.isRequired
	},

	getInitialState: function() {
		return {
		};
	},

	componentWillMount: function() {
		resolveUser(this.props).then(user => {
			this.setState({user});
		});
	},

	render () {
		let {user} = this.state;

		if (!user) {
			return <Loader />;
		}

		return (
			<div className="profile-head-summary">
				<div className="label">
					<DisplayName username={this.props.username}/>
				</div>
				<ul className="profile-head-summary-attrs">
					{[
						'education',
						'affiliation',
						'location',
						'home_page'].map( attr => user[attr] && <li className={attr}>{user[attr]}</li>)}
				</ul>
			</div>
		);
	}
});
