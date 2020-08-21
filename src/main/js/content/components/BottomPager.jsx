import './BottomPager.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Pager } from '@nti/web-content';
import { getHistory, LinkTo } from '@nti/web-routing';
import { encodeForURI } from '@nti/lib-ntiids';

import {isAssignment} from './viewer-parts/assessment';

class BottomPager extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object,
		getAssessment: PropTypes.func.isRequired,
		rootId: PropTypes.string.isRequired,
		currentPage: PropTypes.string.isRequired
	}

	static contextTypes = {
		router: PropTypes.object
	};

	static childContextTypes = {
		router: PropTypes.object
	}

	getChildContext () {
		const {router: nav} = this.context;
		const router = {
			...(nav || {}),
			baseroute: nav && nav.makeHref(''),
			getRouteFor: this.getRouteFor,
			history: getHistory(),
			routeTo: {
				object: (...args) => LinkTo.Object.routeTo(router, ...args)
			}
		};

		return {
			router
		};
	}

	getRouteFor = (obj = {}, context) =>{
		if (context === 'previous-page' || context === 'next-page') {
			return this.context.router.makeHref(obj.ref, false) + '/';
		} else if (obj.NavNTIID) {
			const parts = (obj && obj.NavNTIID.split('#')) || [];
			parts[0] = encodeForURI(parts[0]) + '/';
			return this.context.router.makeHref(parts.join('#'), false);
		}
	}

	render () {
		const { contentPackage, getAssessment, rootId, currentPage } = this.props;

		if (isAssignment(getAssessment())) {
			return null;
		}

		return (
			<Pager
				contentPackage={contentPackage}
				rootId={rootId}
				currentPage={currentPage}
			/>
		);
	}
}

export default BottomPager;
