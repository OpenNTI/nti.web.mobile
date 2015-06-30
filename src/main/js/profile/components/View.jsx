import React from 'react/addons';

import Router from 'react-router-component';

import Loading from 'common/components/Loading';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';

import NotFound from 'notfound/components/View';

import Page from './Page';
import Activity from './Activity';
import Achievements from './Achievements';
import About from './About';

import Redirect from 'navigation/components/Redirect';

import {resolve, decode} from 'common/utils/user';

const ROUTES = [
	{path: '/activity(/*)',		handler: Activity },
	{path: '/achievements(/*)',	handler: Achievements },
	{path: '/about(/*)',		handler: About },
	{}//default
];

export default React.createClass({
	displayName: 'profile:View',
	mixins: [BasePathAware, ContextSender],

	propTypes: {
		username: React.PropTypes.string.isRequired
	},

	getInitialState () {
		return {};
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


	updateUser(props = this.props) {
		this.setState({user: null}, () =>
			resolve(props, true)
				.catch(()=> false)
				.then(user => {
					console.debug('User: ', user);
					this.setState({user});
				}));
	},

	componentWillReceiveProps (nextProps) {
		if (nextProps.username !== this.props.username) {
			this.updateUser(nextProps);
		}
	},

	componentDidMount () {
		this.updateUser();

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
		let {user} = this.state;


		if (user == null) {
			return ( <Loading /> );
		}

		if (user === false) {
			return ( <NotFound/> );
		}

		return React.createElement(Router.Locations, {ref: 'router', contextual: true},
			...ROUTES.map(route=>
				route.path ?
				<Router.Location {...route}
					handler={Page} pageContent={route.handler}
					user={user}
					username={decode(username, true)}
					/> :
				<Router.NotFound handler={Redirect} location="/about/"/>
			));
	}
});
