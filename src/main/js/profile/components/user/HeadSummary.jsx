import React from 'react';
import PropTypes from 'prop-types';
import {User} from '@nti/web-client';
import {Loading} from '@nti/web-commons';
import {Array as ArrayUtils} from '@nti/lib-commons';

import {default as DisplayName} from 'common/components/DisplayName';

import SocialLinks from './SocialLinks';


export default class extends React.Component {
	static displayName = 'HeadSummary';

	static propTypes = {
		entity: PropTypes.any.isRequired
	};

	state = {
	};

	componentDidMount () {
		this.setUser();
	}

	componentDidUpdate (prevProps) {
		if (this.props.entity !== prevProps.entity) {
			this.setUser();
		}
	}

	setUser = (props = this.props) => {
		User.resolve(props).then(user => this.setState({user}));
	};

	render () {
		let {user} = this.state;

		if (!user) {
			return <Loading.Ellipse />;
		}

		let {positions, education, location} = user;
		let homePage = user.home_page;

		let position = ArrayUtils.ensure(positions)[0]; //TODO: pick "latest" (start year)?

		education = ArrayUtils.ensure(education)[0]; //TODO: pick "latest" (start year)?

		//Is the affiliation field deprecated in favor of professional positions?

		return (
			<div className="profile-head-summary">
				<div className="label">
					<DisplayName entity={this.props.entity}/>
				</div>
				<ul className="profile-head-summary-attrs">
					{education && (
						<li className="education">
							{[education.degree, education.school].filter(x=>x).join(' at ')}
						</li>
					)}

					{position && (
						<li className="affiliation">
							{[position.title, position.companyName].join(' at ')}
						</li>
					)}

					{ (location || homePage) && (
						<li className="location">
							{location && ( <span className="location">{location}</span> )}
							{homePage && ( <a className="home-page" href={homePage} target="_blank" rel="noopener noreferrer">{homePage}</a> )}
						</li>
					)}
				</ul>
				<SocialLinks user={user} />
			</div>
		);
	}
}
