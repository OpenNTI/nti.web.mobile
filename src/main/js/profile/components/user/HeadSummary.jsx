import PropTypes from 'prop-types';
import React from 'react';

import {User} from 'nti-web-client';
import {Loading} from 'nti-web-commons';
import {Array as ArrayUtils} from 'nti-commons';

import SocialLinks from './SocialLinks';

import {default as DisplayName} from 'common/components/DisplayName';


export default class extends React.Component {
    static displayName = 'HeadSummary';

    static propTypes = {
		entity: PropTypes.any.isRequired
	};

    state = {
    };

    componentWillMount() {
		this.setUser();
	}

    componentWillReceiveProps(nextProps) {
		let {entity} = this.props;
		if (entity !== nextProps.entity) {
			this.setUser(nextProps);
		}
	}

    setUser = (props = this.props) => {
		User.resolve(props).then(user => this.setState({user}));
	};

    render() {
		let {user} = this.state;

		if (!user) {
			return <Loading.Ellipse />;
		}

		let {positions, education, location} = user;
		let homePage = user.home_page; //eslint-disable-line camecase

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
							{homePage && ( <a className="home-page" href={homePage} target="_blank">{homePage}</a> )}
						</li>
					)}
				</ul>
				<SocialLinks user={user} />
			</div>
		);
	}
}
