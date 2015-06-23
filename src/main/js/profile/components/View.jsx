import React from 'react/addons';

import {Locations, Location, NotFound} from 'react-router-component';
import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';
import Activity from './Activity';
import Achievements from './Achievements';
import About from './About';
import ActiveLink from 'forums/components/ActiveLink';
import LogoutButton from 'login/components/LogoutButton';
import {getAppUsername} from 'common/utils';
import FollowButton from './FollowButton';
import EditButton from './EditButton';
import NavigationBar from 'navigation/components/Bar';

import Gradient from 'common/components/GradientBackground';
import Head from './Head';

import NavigatableMixin from 'common/mixins/NavigatableMixin';

import resolveUser from 'common/utils/resolve-user';

export default React.createClass({
	displayName: 'profile:View',
	mixins: [BasePathAware, ContextSender, NavigatableMixin],

	propTypes: {
		username: React.PropTypes.string.isRequired
	},

	getInitialState: function() {
		return {
		};
	},

	getContext (/*props*/) {
		let path = this.getBasePath();
		return Promise.resolve([
			{
				href: path, label: 'Home'
			}, {
				href: location.href,
				label: 'Profile'
			}
		]);
	},

	setUser(u) {
		this.setState({
			user: u
		});
	},

	componentDidMount () {
		resolveUser(this.props).then(u => {
			console.debug('User: ', u);
			this.setUser(u);
		});

		/*
		alias
		firstName
		displayName
		lastName
		realname
		email

		birthdate

		avatarURL
		backgroundURL

		affiliation
		description
		education
		home_page
		interests
		location
		positions
		role

		facebook
		googlePlus
		linkedIn
		twitter
		 */
	},

	render () {
		let {username} = this.props;
		username = decodeURIComponent(username);
		let me = username === getAppUsername();
		return (
			<div>
				<NavigationBar title="Profile" />
				<Gradient className="profile-wrapper">
					<div className="profile-top-controls">
						<ul className="profile-top-controls-breadcrumb">
							<li>People</li>
							<li>{username}</li>
						</ul>
						<ul className="profile-top-controls-buttons">
							{me && <li><LogoutButton/></li>}
							<li>{me ? <EditButton/> : <FollowButton />}</li>
						</ul>
					</div>
					<div className="profile">
						<Head {...this.props} />
						<ul className="profile-nav">
							<li className="profile-nav-item"><ActiveLink href={this.makeHref('/about/', true)}>About</ActiveLink></li>
							<li className="profile-nav-item"><ActiveLink href={this.makeHref('/activity/', true)}>Activity</ActiveLink></li>
							<li className="profile-nav-item"><ActiveLink href={this.makeHref('/achievements/', true)}>Achievements</ActiveLink></li>
						</ul>
						<Locations contextual ref="router">
							<Location
								path="/activity(/*)"
								handler={Activity}
								user={this.state.user}
							/>
							<Location
								path="/achievements(/*)"
								handler={Achievements}
								user={this.state.user}
							/>
							<Location
								path="/about(/*)"
								handler={About}
								user={this.state.user}
							/>
							<NotFound handler={About} />
						</Locations>
					</div>
				</Gradient>
			</div>
		);
	}
});
