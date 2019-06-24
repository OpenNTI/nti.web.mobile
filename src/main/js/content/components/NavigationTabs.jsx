import React from 'react';
import PropTypes from 'prop-types';
import {Router, Route} from '@nti/web-routing';
import {Navigation} from '@nti/web-content';
import {getAppUserScopedStorage, isFlag} from '@nti/web-client';
import {encodeForURI} from '@nti/lib-ntiids';

const seen = 'seen';
const key = 'nti-content-tabs-seen';
const storage = getAppUserScopedStorage();

function hasBeenSeen () {
	return storage.getItem(key) === seen;
}

function setSeen () {
	storage.setItem(key, seen);
}

class ContentNavigationTabs extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object.isRequired
	}

	static contextTypes = {
		router: PropTypes.object
	}

	static childContextTypes = {
		router: PropTypes.shape({
			getRouteFor: PropTypes.func
		})
	}

	getChildContext () {
		return {
			router: {
				...this.context.router,
				baseroute: this.getBaseRoute(),
				getRouteFor: (...args) => this.getRouteFor(...args)
			}
		};
	}

	getBaseRoute () {
		const {contentPackage} = this.props;
		
		return `/mobile/content/${encodeForURI(contentPackage.getID())}/`;
	}

	componentDidMount () {
		setTimeout(() => {
			setSeen();
		}, 1000);
	}

	getRouteFor (obj, context) {
		const {contentPackage:content} = this.props;

		if (obj !== content) { return; }

		const base = `/mobile/content/${encodeForURI(content.getID())}/`;
		let part = '';

		if (context === 'content') {
			part = 'o';
		} else if (context === 'discussions') {
			part = 'd';
		} else if (context === 'notebook') {
			part = 'n';
		}

		return `${base}${part}/`;
	}


	render () {
		const {contentPackage} = this.props;

		return (
			<Navigation.BookTabs
				content={contentPackage}
				expandTabs={!hasBeenSeen()}
				excludeTabs={isFlag('show-notebook-tab') ? [] : ['notebook']}
			/>
		);
	}
}

export default Router.for([
	Route({path: '/', component: ContentNavigationTabs})
]);

