import React from 'react';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import TinyLoader from 'common/components/TinyLoader';

import NavigatableMixin from 'common/mixins/NavigatableMixin';

import {scoped} from 'common/locale';

import {mimeTypes, FORUM} from '../../Constants';

import ForumMixin from './Mixin';
import ToggleStateMixin from '../../mixins/ToggleState';

const t = scoped('FORUMS');

/**
 * For lists of Forums, this is the row item.
 */
export default React.createClass({
	displayName: 'list-items:ForumItem',
	mixins: [
		ForumMixin,
		NavigatableMixin,
		ToggleStateMixin
	],

	statics: {
		inputType: mimeTypes[FORUM]
	},

	propTypes: {
		item: React.PropTypes.object,
		parentPath: React.PropTypes.string,
		topicsComponent: React.PropTypes.node
	},

	getInitialState() {
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
				<h1 onClick={this.toggleState.bind(this, 'showRecentActivity')} className={headingCss.join(' ')}>
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

		if (this.state.loading) {
			return (
				<TinyLoader />
			);
		}
		let {item} = this.props;
		// let topicCount = t('topicCount', { count: item.TopicCount });

		return (
			<div className="forum-item">
				<a href={this.getHref()} className="blockLink">
					<h3>
						<span className="title">{item.title}</span>
						<div className="meta">
							<span className="see-all count" href={this.getHref()}>{t('topicCount', {count: this.state.totalItemCount})}</span>
						</div>
						<span className="arrow-right"/>

					</h3>
				</a>
				{this.renderRecentActivity()}
			</div>
		);
	}
});
