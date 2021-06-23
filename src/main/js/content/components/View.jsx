import React from 'react';
import PropTypes from 'prop-types';
import Router from 'react-router-component';

import { decodeFromURI } from '@nti/lib-ntiids';
import { getService } from '@nti/web-client';
// import { PACKAGE_NOT_FOUND, getPackage } from '@nti/lib-content-processing';
import {
	Error as ErrorWidget,
	Loading,
	Background,
	Presentation,
	Hooks,
} from '@nti/web-commons';
import { Component as ContextContributor } from 'internal/common/mixins/ContextContributor';
import Redirect from 'internal/navigation/components/Redirect';
import NotFound from 'internal/notfound/components/View';
import Discussions from 'internal/forums/components/View';

import Community from './community';
import Index from './Index';
import Page from './Page';
import Notebook from './Notebook';

const { useResolver } = Hooks;
const { isPending } = useResolver;

FindPage.propTypes = {
	contentPackage: PropTypes.object,
};
function FindPage({ contentPackage }) {
	const resolver = useResolver(async () => {
		const packages = await contentPackage.getContentPackages();

		return packages[0];
	}, [contentPackage]);

	const pack = isPending(resolver) ? null : resolver;

	const path = global.location && global.location.pathname;
	const hash = global.location && global.location.hash;

	if (!path || !pack) {
		return null;
	}

	const [pre, page] = path.split('/page/');
	const root = pack.getID();

	const newPath = `${pre}/o/${root}/${page}/${hash || ''}`;

	return <Redirect location={newPath} force />;
}

const ROUTES = [
	// {path: '/v(/*)', pageContent: Media},
	{ path: '/o(/*)', pageContent: Index },
	{ path: '/page(/*)', pageContent: FindPage },
	{ path: '/d(/*)', pageContent: Discussions },
	{ path: '/n(/*)', pageContent: Notebook },
	{ path: '/community(/*)', pageContent: Community },
	// {path: '/info', pageContent: PackageInfo},
	{}, //not found
];

export default class ContentView extends React.Component {
	static propTypes = {
		/**
		 * The NTIID of the content Package/Bundle/Thing to view.
		 *
		 * @type {string}
		 */
		contentId: PropTypes.string.isRequired,
	};

	state = {};

	componentDidMount() {
		this.loadContentPackage(this.props);
	}

	componentDidUpdate(prevProps) {
		if (this.props.contentId !== prevProps.contentId) {
			this.loadContentPackage(this.props);
		}
	}

	async loadContentPackage(props) {
		let { contentId } = props;

		if (!contentId) {
			throw new Error('Missing contentId');
		}

		contentId = decodeFromURI(contentId);

		this.setState({ loading: true, contentPackage: null, error: null });

		try {
			const service = await getService();
			const contentPackage = await service.getObject(contentId);
			this.setState({ contentPackage, loading: false });
		} catch (error) {
			this.setState({ error });
		}
	}

	renderContent() {
		return React.createElement(
			Router.Locations,
			{ contextual: true },
			...ROUTES.map(route =>
				route.path
					? React.createElement(Router.Location, {
							handler: Page,
							contentPackage: this.state.contentPackage,
							...route,
					  })
					: React.createElement(Router.NotFound, {
							handler: Redirect,
							location: 'o/',
					  })
			)
		);
	}

	render() {
		let { contentPackage, error, loading } = this.state;

		const render = () => {
			if (loading) {
				return <Loading.Mask />;
			}

			if (error) {
				return <ErrorWidget error={error} />;
			}

			if (!contentPackage) {
				return <NotFound />;
			}

			return (
				<Presentation.Asset
					propName="imgUrl"
					type="background"
					contentPackage={contentPackage}
				>
					<Background>{this.renderContent()}</Background>
				</Presentation.Asset>
			);
		};

		return (
			<ContextContributor getContext={getContext}>
				{render()}
			</ContextContributor>
		);
	}
}

async function getContext() {
	const context = this; //called with ContextContributor's scope.

	return [
		{
			label: 'Books',
			href: context.getBasePath(),
		},
	];
}
