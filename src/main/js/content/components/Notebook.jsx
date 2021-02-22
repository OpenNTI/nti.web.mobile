import './Notebook.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { getHistory, LinkTo } from '@nti/web-routing';
import { Stream } from '@nti/web-profiles';
import { getModel } from '@nti/lib-interfaces';
import { User } from '@nti/web-client';
import { encodeForURI } from '@nti/lib-ntiids';

import { Component as ContextSender } from 'common/mixins/ContextSender';
import { Component as ContextContributor } from 'common/mixins/ContextContributor';

const HighLight = getModel('highlight');
const Bookmark = getModel('bookmark');
const Note = getModel('note');
const Bundle = getModel('contentpackagebundle');

export default class Notebook extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object,
	};

	static contextTypes = {
		router: PropTypes.object,
		basePath: PropTypes.string,
	};

	static childContextTypes = {
		router: PropTypes.object,
	};

	getChildContext() {
		const { router: nav } = this.context;
		const router = {
			...(nav || {}),
			baseroute: nav && nav.makeHref(''),
			getRouteFor: this.getRouteFor,
			history: getHistory(),
			routeTo: {
				object: (...args) => LinkTo.Object.routeTo(router, ...args),
			},
		};

		return {
			router,
		};
	}

	getRouteFor = (object, context) => {
		if (object instanceof HighLight) {
			return `${this.context.basePath}object/${encodeForURI(
				object.getID()
			)}/`;
		} else if (object instanceof Bookmark) {
			return `${this.context.basePath}object/${encodeForURI(
				object.getID()
			)}/`;
		} else if (object instanceof Note) {
			return `${this.context.basePath}object/${encodeForURI(
				object.getID()
			)}/`;
		} else if (object.isUser) {
			return `${this.context.basePath}profile/${User.encode(
				object.Username
			)}/`;
		} else if (object instanceof Bundle) {
			return `${this.context.basePath}content/${encodeForURI(
				object.getID()
			)}/`;
		}
	};

	makeHref(...args) {
		return this.contextProvider
			? this.contextProvider.makeHref(...args)
			: null;
	}

	render() {
		return (
			<ContextContributor getContext={getContext}>
				<ContextSender />
				<Stream context={this.props.contentPackage} isMobile />
			</ContextContributor>
		);
	}
}

async function getContext() {
	const context = this; //this will be called with the ContextContributor's context ("this")

	return {
		href: context.makeHref('/n'),
		label: 'Notebook',
	};
}
