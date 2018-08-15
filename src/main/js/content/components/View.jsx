import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Router from 'react-router-component';
import {decodeFromURI} from '@nti/lib-ntiids';
import {PACKAGE_NOT_FOUND, getPackage} from '@nti/lib-content-processing';
import {
	Error as ErrorWidget,
	Loading,
	Mixins
} from '@nti/web-commons';

import ContextContributor from 'common/mixins/ContextContributor';
import Redirect from 'navigation/components/Redirect';
import NotFound from 'notfound/components/View';
import Discussions from 'forums/components/View';


import Index from './Index';
import Page from './Page';


const ROUTES = [
	// {path: '/v(/*)', pageContent: Media},
	{path: '/o(/*)', pageContent: Index},
	{path: '/d(/*)', pageContent: Discussions},
	// {path: '/info', pageContent: PackageInfo},
	{}//not found
];

export default createReactClass({
	displayName: 'ContentView',
	mixins: [Mixins.BasePath, ContextContributor],

	propTypes: {
		/**
		 * The NTIID of the content Package/Bundle/Thing to view.
		 * @type {string}
		 */
		contentId: PropTypes.string.isRequired
	},


	getInitialState () {
		return {};
	},


	componentDidMount () {
		this.loadContentPackage(this.props);
	},


	componentWillReceiveProps (nextProps) {
		if (this.props.contentId !== nextProps.contentId) {
			this.loadContentPackage(nextProps);
		}
	},


	loadContentPackage (props) {
		let {contentId} = props;

		if (!contentId) {
			throw new Error('Missing contentId');
		}

		contentId = decodeFromURI(contentId);

		this.setState({loading: true, contentPackage: null, error: null});

		getPackage(contentId)
			.then(contentPackage => this.setState({contentPackage}))
			.catch(error=> this.setState(
				error === PACKAGE_NOT_FOUND ? {contentPackage: null} : {error}))
			.then(()=> this.setState({loading: false}));
	},


	render () {
		let {contentPackage, error, loading} = this.state;

		if (loading) {
			return ( <Loading.Mask /> );
		}

		if (error) {
			return ( <ErrorWidget error={error}/> );
		}

		if (!contentPackage) {
			return ( <NotFound/> );
		}

		return React.createElement(Router.Locations, {contextual: true},
			...ROUTES.map(route=>
				route.path ?
					React.createElement(Router.Location, {handler: Page, contentPackage, ...route}) :
					React.createElement(Router.NotFound, {handler: Redirect, location: 'o/'})
			));
	},


	getContext () {
		return Promise.resolve([
			{
				label: 'Books',
				href: this.getBasePath()
			}
		]);
	}
});
