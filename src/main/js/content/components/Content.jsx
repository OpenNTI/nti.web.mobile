import React from 'react';
import ReactDOM from 'react-dom';

import Logger from 'nti-util-logger';
import {declareCustomElement, getEventTarget} from 'nti-lib-dom';
import isTouchDevice from 'nti-util-detection-touch';

import {rawContent} from 'nti-commons';

import {getWidget} from './widgets';

function getComparable (o) {
	return o && o.page;
}

declareCustomElement('error');
declareCustomElement('nti:content');
declareCustomElement('widget');

const logger = Logger.get('content:viewer:body');

export default class Content extends React.Component {

	static propTypes = {
		contentPackage: React.PropTypes.object,
		page: React.PropTypes.object.isRequired,
		pageId: React.PropTypes.string.isRequired,
		onContentReady: React.PropTypes.func,
		onUserSelectionChange: React.PropTypes.func
	}


	static defaultProps = {
		onContentReady: () => {},
		onUserSelectionChange: hasSelection => logger.debug('Touch ended, has selection?', hasSelection)
	}


	state = { pageWidgets: {} }


	componentDidMount () {
		this.onContentMaybeReady();
	}


	componentWillUnmount () {
		this.cleanupWidgets();
	}


	componentDidUpdate (prevProps) {
		let shouldUpdate = getComparable(prevProps) !== getComparable(this.props);
		this.onContentMaybeReady(shouldUpdate);
	}


	componentWillReceiveProps (nextProps) {
		if (getComparable(nextProps) !== getComparable(this.props)) {
			this.cleanupWidgets();
		}
	}


	onContentMaybeReady (shouldUpdate) {
		if (this.updatingPrestine) {
			return;
		}
		//See if we need to re-mount/render our components...
		let widgets = this.getPageWidgets();
		let widgetCount = Object.keys(widgets).length;
		shouldUpdate = shouldUpdate || (widgetCount === 0 && !this.state.prestine);

		if (widgets && this.content) {
			logger.debug('mounting widgets: %o', widgets);

			for(let id of Object.keys(widgets)) {
				let el = document.getElementById(id);
				let w = widgets[id];
				if (el && !el.hasAttribute('mounted')) {
					logger.debug('Mounting Widget... %o', el);
					try {
						shouldUpdate = true;
						ReactDOM.render(w, el);
						el.setAttribute('mounted', 'true');
					} catch (e) {
						logger.error('A content widget blew up while rendering: %s', e.stack || e.message || e);
					}
				} else {
					logger.debug('Skipping widget... because we did not have an element, or it had a mounted attribute: %o', el);
				}
			}
		}

		if (shouldUpdate) {
			this.updatePrestine();
			this.props.onContentReady();
		}
	}


	cleanupWidgets () {
		//Cleanup our components...
		let widgets = this.getPageWidgets();

		for(let id of Object.keys(widgets)) {
			let el = document.getElementById(id);
			if (el) {
				if (!ReactDOM.unmountComponentAtNode(el)) {
					logger.warn('Widget was not unmounted: %s', id);
				} else {
					logger.debug('Unmounted widget: %s', id);
				}
				el.removeAttribute('mounted');
				delete widgets[id];
			}
			else {
				logger.warn('Widget not found: %s', id);
			}
		}
	}


	createWidget (widgetData) {
		let widgets = this.getPageWidgets();
		if (!widgets[widgetData.guid]) {
			// logger.debug('Content View: Creating widget for %s', widgetData.guid);
			widgets[widgetData.guid] = getWidget(
				widgetData,
				this.props.page,
				{...this.props, id: void 0});
		}
	}


	getPageWidgets () {
		let {pageWidgets} = this.state;
		let {pageId} = this.props;

		if (pageWidgets && !pageWidgets[pageId]) {
			logger.debug('Creating bin for PageWidgets for %s', pageId);
			pageWidgets[pageId] = {};
		}

		return pageWidgets[pageId];
	}


	getCurrent = () => this.content


	getPristine = () => this.state.prestine


	updatePrestine () {
		let current = this.getCurrent();
		let prestine = current && current.cloneNode(true);
		this.updatingPrestine = true;
		this.setState({prestine}, () => delete this.updatingPrestine);
		// logger.debug('Updated Prestine', prestine);
	}


	buildBody = (part) => {

		if (typeof part === 'string') {
			return part;
		}

		this.createWidget(part);

		return `<widget id="${part.guid}"><error><span>Missing Component</span></error></widget>`;
		// return `<widget id="${part.guid}"><error>If this is still visible, something went wrong.</error></widget>`;
	}


	attachContentRef = (ref) => this.content = ref


	render () {
		const {pageId, page, ...otherProps} = this.props;
		const body = page.getBodyParts();
		const styles = (page && page.getPageStyles()) || [];

		const wrapperProps = {
			[isTouchDevice ? 'onTouchEnd' : 'onMouseUp']: this.detectSelection
		};

		const props = {...otherProps,
			ref: this.attachContentRef,
			className: 'nti-content-panel',
			'data-ntiid': pageId,
			'data-page-ntiid': pageId
		};

		for (let key of Object.keys(Content.propTypes)) {
			delete props[key];
		}

		const content = body.map(this.buildBody).join('');

		return (
			<div {...wrapperProps}>
				{styles.map((css, i) =>
					<style scoped type="text/css" key={i} {...rawContent(css)}/>
				)}
				{
				// <nti:content {...props}>
				// 	<div id="NTIContent" dangerouslySetInnerHTML={content} />
				// </nti:content?>
				//
				// 	Since the above JSX blows up because of the "namespace", do it w/o JSX:
					React.createElement('nti:content', props,
						<div id="NTIContent" {...rawContent(content)}/>
					)
				}
			</div>
		);
	}

	detectSelection = (e) => {
		let capture = {
			srcElement: e.srcElement,
			target: e.target
		};

		if( getEventTarget(e, 'input') || getEventTarget(e, '[contenteditable]') ) {
			return;
		}

		let s = window.getSelection();
		let range = s && !s.isCollapsed && s.type === 'Range' && s.getRangeAt(0);

		logger.debug('Selection Detection Running...', s, range);

		this.props.onUserSelectionChange(capture, range);

	}
}
