import React from 'react';

import isEmpty from 'dataserverinterface/utils/isempty';
import waitFor from 'dataserverinterface/utils/waitfor';

import Loading from 'common/components/Loading';

import BasePathAware from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'OutlineView',
	mixins: [BasePathAware],

	propTypes: {
		course: React.PropTypes.object.isRequired
	},


	getInitialState () {
		return {loading:true};
	},


	componentDidMount () {
		this.getDataIfNeeded(this.props);
	},


	componentWillReceiveProps (nextProps) {
		if (nextProps.course !== this.props.course) {
			this.getDataIfNeeded(nextProps);
		}
	},


	getDataIfNeeded (props) {
		this.setState({loading: true});
		var course = props.course;
		var outline = [];
		var work = !course ? Promise.reject() :
			course.getOutline()
				.then(data => (outline = data));

		var map = this._DEPTH_MAP = [
			'h3',
			'div'
		];

		var prefix = this.getBasePath();

		waitFor(work)
			.then(() => {
				if (outline.maxDepth > 2) {
					map.unshift('h1');
				}

				this.setState({
					loading: false,
					outline: outline,
					prefix: prefix
				});
			});
	},


	render () {
		var outline = this.state.outline;

		if (this.state.loading) {
			return (<Loading/>);
		}

		return (
			<div>
				{this._renderTree(outline.contents)}
			</div>
		);
	},


	_renderTree (list) {
		var _renderTree = this._renderTree;
		var depthMap = this._DEPTH_MAP;
		var prefix = this.state.prefix || '';

		if (isEmpty(list)) {
			return null;
		}

		return (
			<ul>
				{list.map(item => {
					var children = _renderTree(item.contents);
					var href = item.href;
					var Tag = depthMap[item.depth - 1] || 'div';

					if (href) {
						href = prefix + href;
					}

					return (
						<li>
							<Tag><a href={href}>{item.title}</a></Tag>
							{children}
						</li>
					);
				})}
			</ul>
		);

	}
});
