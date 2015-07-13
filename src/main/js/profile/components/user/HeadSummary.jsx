import React from 'react';

import ensureArray from 'nti.lib.interfaces/utils/ensure-array';

import Loader from 'common/components/TinyLoader';
import SocialLinks from './SocialLinks';

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

		let {positions, education, location} = user;
		let homePage = user.home_page; //eslint-disable-line camecase

		let position = ensureArray(positions)[0]; //TODO: pick "latest" (start year)?

		education = ensureArray(education)[0]; //TODO: pick "latest" (start year)?

		//Is the affiliation field deprecated in favor of professional positions?

		return (
			<div className="profile-head-summary">
				<div className="label">
					<DisplayName username={this.props.username}/>
				</div>
				<ul className="profile-head-summary-attrs">
					{education && (
						<li className='education'>{[education.degree, education.school].filter(x=>x).join(' at ')}</li>
					)}

					{position && ( <li className="affiliation"><span className="title">{position.title}</span> at <span className="company">{position.companyName}</span></li> )}

					{ (location || homePage) && (
						<li className="location">
							{location && ( <span className="location">{location}</span> )}
							{homePage && ( <a className="home-page" href={homePage} target="_blank">{homePage}</a> )}
						</li>
					)}
				</ul>
				<SocialLinks user={user} />
			</div>
		);
	}
});
