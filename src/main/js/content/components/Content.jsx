import './Content.scss';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import { reportError } from '@nti/web-client';
import Logger from '@nti/util-logger';
import { declareCustomElement, getEventTarget } from '@nti/lib-dom';
import isTouchDevice from '@nti/util-detection-touch';
import { rawContent, buffer } from '@nti/lib-commons';
import { Mixins, NTIContent } from '@nti/web-commons';
import ContextAccessor from 'internal/common/mixins/ContextAccessor';

import { getWidget } from './widgets';

function getComparable(o) {
	return o && o.page;
}

declareCustomElement('error');
declareCustomElement('widget');

const logger = Logger.get('content:viewer:body');

function getContextWrapper(context) {
	return class ContextWrapper extends React.Component {
		static propTypes = { children: PropTypes.any };

		static childContextTypes = Object.keys(context).reduce(
			(_, p) => ((_[p] = PropTypes.any), _),
			{}
		);

		getChildContext() {
			return context;
		}

		componentDidCatch(error) {
			reportError(error);
			this.setState({ error });
		}

		render() {
			return this.state?.error ? null : this.props.children;
		}
	};
}

export default class Content extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object,
		page: PropTypes.object.isRequired,
		pageId: PropTypes.string.isRequired,
		onContentReady: PropTypes.func,
		onUserSelectionChange: PropTypes.func,
	};

	static contextTypes = {
		...ContextAccessor.contextTypes,
		...Mixins.NavigationAware.contextTypes,
		analyticsManager: PropTypes.object.isRequired,
	};

	static defaultProps = {
		onContentReady: () => {},
		onUserSelectionChange: hasSelection =>
			logger.debug('Touch ended, has selection?', hasSelection),
	};

	state = { pageWidgets: {} };

	componentDidMount() {
		this.onContentMaybeReady();
	}

	componentWillUnmount() {
		this.scheduleUpdate.cancel();
		this.cleanupWidgets();
		this.unmounted = true;
	}

	shouldComponentUpdate(prevProps) {
		const shouldUpdate =
			getComparable(prevProps) !== getComparable(this.props);

		if (shouldUpdate) {
			this.cleanupWidgets();
		}

		return shouldUpdate;
	}

	componentDidUpdate(prevProps) {
		const shouldUpdate =
			getComparable(prevProps) !== getComparable(this.props);

		this.onContentMaybeReady(shouldUpdate);
	}

	onContentMaybeReady(shouldUpdate) {
		if (this.updatingPristine) {
			return;
		}
		//See if we need to re-mount/render our components...
		let widgets = this.getPageWidgets();
		let widgetCount = Object.keys(widgets).length;
		shouldUpdate =
			shouldUpdate || (widgetCount === 0 && !this.state.pristine);

		if (widgets && this.content) {
			logger.debug('mounting widgets: %o', widgets);

			for (let id of Object.keys(widgets)) {
				let el = document.getElementById(id);
				let w = widgets[id];
				if (el && !el.hasAttribute('mounted')) {
					logger.debug('Mounting Widget... %o', el);
					try {
						shouldUpdate = true;
						//XXX: Use React 16 portals instead
						ReactDOM.render(w, el);
						el.setAttribute('mounted', 'true');
					} catch (e) {
						logger.error(
							'A content widget blew up while rendering: %s',
							e.stack || e.message || e
						);
					}
				} else {
					logger.debug(
						'Skipping widget... because we did not have an element, or it had a mounted attribute: %o',
						el
					);
				}
			}
		}

		if (shouldUpdate) {
			this.scheduleUpdate();
		}
	}

	cleanupWidgets() {
		//Cleanup our components...
		let widgets = this.getPageWidgets();

		for (let id of Object.keys(widgets)) {
			let el = document.getElementById(id);
			if (el) {
				if (!ReactDOM.unmountComponentAtNode(el)) {
					logger.warn('Widget was not unmounted: %s', id);
				} else {
					logger.debug('Unmounted widget: %s', id);
				}
				el.removeAttribute('mounted');
				delete widgets[id];
			} else {
				logger.warn('Widget not found: %s', id);
			}
		}
	}

	createWidget(widgetData) {
		let widgets = this.getPageWidgets();
		if (!widgets[widgetData.guid]) {
			// logger.debug('Content View: Creating widget for %s', widgetData.guid);
			const Wrapper = getContextWrapper(this.context);
			widgets[widgetData.guid] = (
				<Wrapper ref={x => this.scheduleUpdate()}>
					{getWidget(widgetData, this.props.page, {
						...this.props,
						id: void 0,
					})}
				</Wrapper>
			);
		}
	}

	getPageWidgets() {
		const { pageWidgets } = this.state;
		const { pageId } = this.props;

		if (pageWidgets && !pageWidgets[pageId]) {
			logger.debug('Creating bin for PageWidgets for %s', pageId);
			pageWidgets[pageId] = {};
		}

		return pageWidgets[pageId];
	}

	getCurrent = () => this.content;

	getPristine = () => this.state.pristine;

	updatePristine() {
		if (this.unmounted) {
			return;
		}

		const current = this.getCurrent();
		const pristine = current?.cloneNode(true);
		this.updatingPristine = true;
		this.setState({ pristine }, () => delete this.updatingPristine);
		// logger.debug('Updated Pristine', pristine);
	}

	scheduleUpdate = buffer(100, () => {
		this.updatePristine();
		this.props.onContentReady();
	});

	buildBody = part => {
		if (typeof part === 'string') {
			return part;
		}

		this.createWidget(part);

		return `<widget id="${part.guid}"><error><span>Missing Component</span></error></widget>`;
		// return `<widget id="${part.guid}"><error>If this is still visible, something went wrong.</error></widget>`;
	};

	attachContentRef = ref => (this.content = ref);

	render() {
		const { pageId, page, ...otherProps } = this.props;
		const body = page.getBodyParts();
		const styles = (page && page.getPageStyles()) || [];

		const wrapperProps = {
			[isTouchDevice ? 'onTouchEnd' : 'onMouseUp']: this.detectSelection,
		};

		const props = {
			...otherProps,
			ref: this.attachContentRef,
			className: 'nti-content-panel', //react does not remap className=>class for custom elements
			'data-ntiid': pageId,
			'data-page-ntiid': pageId,
		};

		for (let key of Object.keys(Content.propTypes)) {
			delete props[key];
		}

		const content = body.map(this.buildBody).join('');

		return (
			<div {...wrapperProps}>
				{styles.map((css, i) => (
					<style
						scoped
						type="text/css"
						key={i}
						{...rawContent(css)}
					/>
				))}
				<NTIContent {...props}>
					<div id="NTIContent" {...rawContent(content)} />
				</NTIContent>
			</div>
		);
	}

	detectSelection = e => {
		let capture = {
			srcElement: e.srcElement,
			target: e.target,
		};

		if (
			getEventTarget(e, 'input') ||
			getEventTarget(e, '[contenteditable]')
		) {
			return;
		}

		let s = window.getSelection();
		let range =
			s && !s.isCollapsed && s.type === 'Range' && s.getRangeAt(0);

		logger.debug('Selection Detection Running...', s, range);

		this.props.onUserSelectionChange(capture, range);
	};
}
