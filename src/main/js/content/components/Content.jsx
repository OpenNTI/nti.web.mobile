import React from 'react';
import ReactDOM from 'react-dom';

import {declareCustomElement} from 'common/utils/dom';
import {getEventTarget} from 'nti.lib.dom';

import {getWidget} from './widgets';

function getComparable (o) {
	return o && o.page;
}

declareCustomElement('error');
declareCustomElement('nti:content');
declareCustomElement('widget');

export default React.createClass({
	displayName: 'content:Viewer:BodyContent',

	propTypes: {
		page: React.PropTypes.object.isRequired,
		pageId: React.PropTypes.string.isRequired,
		onContentReady: React.PropTypes.func,
		onUserSelectionChange: React.PropTypes.func
	},


	getDefaultProps () {
		return {
			onContentReady: () => {},
			onUserSelectionChange: hasSelection => console.debug('Touch ended, has selection?', hasSelection)
		};
	},


	getInitialState () {
		return {
			pageWidgets: {}
		};
	},


	componentDidMount () {
		this.onContentMaybeReady();
	},


	componentDidUpdate (prevProps) {
		let shouldUpdate = getComparable(prevProps) !== getComparable(this.props);
		this.onContentMaybeReady(shouldUpdate);
	},


	componentWillReceiveProps (nextProps) {
		if (getComparable(nextProps) !== getComparable(this.props)) {
			this.cleanupWidgets();
		}
	},


	onContentMaybeReady (shouldUpdate) {
		if (this.updatingPrestine) {
			return;
		}
		//See if we need to re-mount/render our components...
		let widgets = this.getPageWidgets();
		let widgetCount = Object.keys(widgets).length;
		shouldUpdate = shouldUpdate || (widgetCount === 0 && !this.state.prestine);

		if (widgets && this.refs.content) {
			// console.debug('Content View: Did Update... %o', widgets);

			for(let id of Object.keys(widgets)) {
				let el = document.getElementById(id);
				let w = widgets[id];
				if (el && !el.hasAttribute('mounted')) {
					// console.debug('Content View: Mounting Widget...');
					try {
						shouldUpdate = true;
						w = ReactDOM.render(w, el);
						el.setAttribute('mounted', 'true');
					} catch (e) {
						console.error('A content widget blew up while rendering: %s', e.stack || e.message || e);
					}
				}
			}
		}

		if (shouldUpdate) {
			this.updatePrestine();
			this.props.onContentReady();
		}
	},


	cleanupWidgets () {
		//Cleanup our components...
		let widgets = this.getPageWidgets();

		for(let id of Object.keys(widgets)) {
			let el = document.getElementById(id);
			if (el) {
				if (!React.unmountComponentAtNode(el)) {
					console.warn('Widget was not unmounted: %s', id);
				}
				el.removeAttribute('mounted');
			}
			else {
				console.warn('Widget not found: %s', id);
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
				Object.assign({}, this.props, {id: void 0}));
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
		return this.refs.content;
	},


	getPristine () {
		return this.state.prestine;
	},


	updatePrestine () {
		let current = this.getCurrent();
		let prestine = current && current.cloneNode(true);
		this.updatingPrestine = true;
		this.setState({prestine}, () => delete this.updatingPrestine);
		// console.debug('Updated Prestine', prestine);
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
		let styles = (page && page.getPageStyles()) || [];

		return (
			<div onMouseUp={this.detectSelection} onTouchEnd={this.detectSelection}>
				{styles.map((css, i) =>
					<style scoped type="text/css" key={i} dangerouslySetInnerHTML={{__html: css}}/>
				)}
				{
				// <nti:content ref="content"
				// 	id="NTIContent"
				// 	className="nti-content-panel"
				// 	data-ntiid={pageId}
				// 	data-page-ntiid={pageId}
				// 	dangerouslySetInnerHTML={{__html: body.map(this.buildBody).join('')}}
				// 	/>
				//
				// 	Since the above JSX blows up because of the "namespace", do it w/o JSX:
					React.createElement('nti:content', {
						id: 'NTIContent',
						ref: 'content',
						className: 'nti-content-panel',
						'data-ntiid': pageId,
						'data-page-ntiid': pageId,
						dangerouslySetInnerHTML: {__html: body.map(this.buildBody).join('')}
					})
				}
			</div>
		);
	},

	detectSelection (e) {
		let capture = {
			srcElement: e.srcElement,
			target: e.target
		};

		if( getEventTarget(e, 'input') || getEventTarget(e, '[contenteditable]') ) {
			return;
		}

		const TICK = 20;

		clearTimeout(this.selectionDetection);

		this.selectionDetection = setTimeout(()=> {
			let s = window.getSelection();
			let hasSelection = s && !s.isCollapsed && s.type === 'Range' && s.getRangeAt(0);

			if (!hasSelection && s) {
				setTimeout(()=> s.removeAllRanges(), TICK);
			}

			this.props.onUserSelectionChange(capture, hasSelection);
		}, TICK);
	}
});
