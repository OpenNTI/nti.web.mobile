import React from 'react';

import ensureArray from 'nti.lib.interfaces/utils/ensure-array';

import Loader from 'common/components/TinyLoader';
import {default as DisplayName} from 'common/components/DisplayName';

import {resolve} from 'common/utils/user';

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
		let {username} = this.props;
		if (username !== nextProps.username) {
			this.setUser(nextProps);
		}
	},

	setUser(props=this.props) {
		resolve(props).then(user => this.setState({user}));
	},

	render () {
		let {user} = this.state;

		if (!user) {
			return <Loader />;
		}

		let {affiliation, education, location} = user;
		let homePage = user.home_page; //eslint-disable-line camecase

		education = ensureArray(education)[0]; //TODO: pick "latest" (start year)?

		//Is the affiliation field deprecated in favor of professional positions?

		return (
			<div className="profile-head-summary">
				<div className="label">
					<DisplayName username={this.props.username}/>
				</div>
				<ul className="profile-head-summary-attrs">
					{education && (
						<li className='education'>{education.degree} at {education.school}</li>
					)}

					{affiliation && ( <li className="affiliation">{affiliation}</li> )}

					{ (location || homePage) && (
						<li className="location">
							{location && ( <span className="location">{location}</span> )}
							{homePage && ( <a className="home-page" href={homePage} target="_blank">{homePage}</a> )}
						</li>
					)}
				</ul>
			</div>
		);
	}
});
