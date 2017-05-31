import PropTypes from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import {encodeForURI} from 'nti-lib-ntiids';

import {Mixins, Loading} from 'nti-web-commons';

import {scoped} from 'nti-lib-locale';

import {mimeTypes, FORUM} from '../../Constants';

import ForumMixin from './Mixin';
import ToggleStateMixin from '../../mixins/ToggleState';

const t = scoped('FORUMS');

/**
 * For lists of Forums, this is the row item.
 */
export default createReactClass({
	displayName: 'list-items:ForumItem',
	mixins: [
		ForumMixin,
		Mixins.NavigatableMixin,
		ToggleStateMixin
	],

	statics: {
		inputType: mimeTypes[FORUM]
	},

	propTypes: {
		item: PropTypes.object,
		parentPath: PropTypes.string,
		topicsComponent: PropTypes.node
	},

	getInitialState () {
		return {
			loading: true,
			showRecentActivity: false,
			recentActivity: []
		};
	},

	componentDidMount () {
		this.load(this.props.item);
	},

	componentWillReceiveProps (nextProps) {
		if (nextProps.item !== this.props.item) {
			this.load(nextProps.item);
		}
	},

	load (forum) {
		forum.getRecentActivity().then(topics => {
			this.setState({
				loading: false,
				recentActivity: topics.Items,
				totalItemCount: topics.TotalItemCount
			});
		});
	},

	getHref () {
		let path = [encodeForURI(this.props.item.getID()), ''];
		if (this.props.parentPath) {
			path.unshift(this.props.parentPath);
		}
		return path.join('/');
	},

	getForumPath () {
		return this.getPath().concat(this.getHref());
	},

	toggleRecentActivity () {
		this.toggleState('showRecentActivity');
	},

	renderRecentActivity () {
		// List component is passed in as a prop to dodge a circular import of List.
		let TopicsComponent = this.props.topicsComponent;
		let {recentActivity} = this.state;
		if (!TopicsComponent || (recentActivity || []).length === 0) { return null; }

		let headingCss = ['disclosure-triangle'];
		if (this.state.showRecentActivity) {
			headingCss.push('open');
		}
		return (
			<section className="recent-activity">
				<h1 onClick={this.toggleRecentActivity} className={headingCss.join(' ')}>
					<a>{t('recentActivity')}</a>
				</h1>
				{this.state.showRecentActivity &&
					<TopicsComponent
						container={{Items: this.state.recentActivity}}
						itemProps={{parentPath: this.getForumPath()}}/>
				}
			</section>
		);
	},

	render () {
		let {totalItemCount, loading} = this.state;

		let {item} = this.props;
		// let topicCount = t('topicCount', { count: item.TopicCount });

		return (
			<div className="forum-item">
				{loading ? (
					<Loading.Ellipse />
				) : (
					<div>
						<a href={this.getHref()} className="blockLink">
							<h3>
								<span className="title">{item.title}</span>
								<div className="meta">
									<span className="see-all count" href={this.getHref()}>{t('topicCount', {count: totalItemCount})}</span>
								</div>
								<span className="arrow-right"/>

							</h3>
						</a>
						{this.renderRecentActivity()}
					</div>
				)}
			</div>
		);
	}
});
