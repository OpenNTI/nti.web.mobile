import React from 'react';

import {getWidget} from './widgets';

function getComparable (o) {
	return o.page;
}

export default React.createClass({
	displayName: 'content:Viewer:BodyContent',

	propTypes: {
		page: React.PropTypes.object.isRequired,
		pageId: React.PropTypes.string.isRequired
	},


	getInitialState () {
		return {
			pageWidgets: {}
		};
	},


	componentDidMount () {
		this.updatePrestine();
	},


	componentDidUpdate (prevProps) {
		if (getComparable(prevProps) !== getComparable(this.props)) {
			this.updatePrestine();
		}

		//See if we need to re-mount/render our components...
		let widgets = this.getPageWidgets();

		if (widgets && this.refs.content) {
			// console.debug('Content View: Did Update... %o', widgets);

			for(let id of Object.keys(widgets)) {
				let el = document.getElementById(id);
				let w = widgets[id];
				if (el && !el.hasAttribute('mounted')) {
					// console.debug('Content View: Mounting Widget...');
					try {
						w = React.render(w, el);
						el.setAttribute('mounted', 'true');
					} catch (e) {
						console.error('A content widget blew up while rendering: %s', e.stack || e.message || e);
					}
				}
			}
		}
	},


	cleanupWidgets () {
		//Cleanup our components...
		let widgets = this.getPageWidgets();

		for(let id of Object.keys(widgets)) {
			let el = document.getElementById(id);
			if (el) {
				React.unmountComponentAtNode(el);
				el.removeAttribute('mounted');
			}
		}
	},


	createWidget (widgetData) {
		let widgets = this.getPageWidgets();
		if (!widgets[widgetData.guid]) {
			// console.debug('Content View: Creating widget for %s', widgetData.guid);
			widgets[widgetData.guid] = getWidget(
				widgetData,
				this.props.page,
				Object.assign({}, this.props));
		}
	},


	getPageWidgets () {
		let {pageWidgets} = this.state;
		let {pageId} = this.props;

		if (pageWidgets && !pageWidgets[pageId]) {
			//console.debug('Content View: Creating bin for PageWidgets for %s', pageId);
			pageWidgets[pageId] = {};
		}

		return pageWidgets && pageWidgets[pageId];
	},


	getCurrent () {
		return React.findDOMNode(this.refs.content);
	},


	getPristine () {
		return this.state.prestine;
	},


	updatePrestine () {
		let current = this.getCurrent();
		let prestine = current && current.cloneNode(true);
		this.setState({prestine});
		// console.debug('Updated Prestine', prestine);

		if (current && current.querySelector('widget[mounted]')) {
			console.warn('Prestine shouldn`t have mounted widgets');
		}
	},


	buildBody (part) {

		if (typeof part === 'string') {
			return part;
		}

		this.createWidget(part);

		return `<widget id="${part.guid}"><error><span>Missing Component</span></error></widget>`;
		// return `<widget id="${part.guid}"><error>If this is still visible, something went wrong.</error></widget>`;
	},


	render () {
		let {pageId, page} = this.props;
		let body = page.getBodyParts();

		return (
			<div {...this.props} ref="content"
				data-ntiid={pageId}
				data-page-ntiid={pageId}
				dangerouslySetInnerHTML={{__html: body.map(this.buildBody).join('')}}/>
		);
	}
});
