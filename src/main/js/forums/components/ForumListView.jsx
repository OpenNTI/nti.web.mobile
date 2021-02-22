import './ForumListView.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { LinkTo } from '@nti/web-routing';
import { encodeForURI } from '@nti/lib-ntiids';
import { Forums } from '@nti/web-discussions';

export default class ForumListView extends React.Component {
	static propTypes = {
		/**
		 * Any model that implements getDiscussions() and getID()
		 * @type {object}
		 */
		bundle: PropTypes.shape({
			getDiscussions: PropTypes.func,
			getID: PropTypes.func,
		}),
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
			routeTo: {
				object: (...args) => LinkTo.Object.routeTo(router, ...args),
			},
		};

		return {
			router,
		};
	}

	getRouteFor = (obj = {}, context) => {
		if (obj.MimeType.includes('application/vnd.nextthought.forums.')) {
			return `${encodeForURI(obj.getID())}/`;
		}
	};

	render() {
		return (
			<TransitionGroup>
				<CSSTransition
					appear
					classNames="fade-out-in"
					timeout={500}
					key="forum"
				>
					<Forums.ForumList bundle={this.props.bundle} />
				</CSSTransition>
			</TransitionGroup>
		);
	}
}
