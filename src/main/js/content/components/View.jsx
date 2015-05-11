import React from 'react';
import Router from 'react-router-component';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import ErrorWidget from 'common/components/Error';
import Loading from 'common/components/Loading';

import BasePathAware from 'common/mixins/BasePath';
import ContextContributor from 'common/mixins/ContextContributor';

import Redirect from 'navigation/components/Redirect';

import NotFound from 'notfound/components/View';

import Index from './Index';
import Discussions from 'forums/components/View';
import Page from './Page';

import {getPackage} from '../Actions';
import {PACKAGE_NOT_FOUND} from '../Constants';

const ROUTES = [
	// {path: '/v(/*)', pageContent: Media},
	{path: '/o(/*)', pageContent: Index},
	{path: '/d(/*)', pageContent: Discussions},
	// {path: '/info', pageContent: PackageInfo},
	{}//not found
];

export default React.createClass({
	displayName: 'ContentView',
	mixins: [BasePathAware, ContextContributor],

	propTypes: {
		/**
		 * The NTIID of the content Package/Bundle/Thing to view.
		 * @type {string}
		 */
		contentId: React.PropTypes.string.isRequired
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
			return ( <Loading/> );
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
				React.createElement(Router.Location, Object.assign({handler: Page, contentPackage}, route)) :
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
