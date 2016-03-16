import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cx from 'classnames';

import Logger from 'nti-util-logger';
import {getModel} from 'nti-lib-interfaces';

import ContentAcquirePrompt from 'catalog/components/ContentAcquirePrompt';

import Loading from 'common/components/TinyLoader';
// import Err from 'common/components/Error';
import {rawContent} from 'common/utils/jsx';

import Content from '../Content';

import {select as getAnnotation} from '../viewer-parts/annotations';
import {getWidget} from '../widgets';

import {getPageContent} from '../../Actions';
import PageDescriptor from '../../PageDescriptor';

const logger = Logger.get('content:components:discussions:Context');

const PageInfo = getModel('pageinfo');


function is403 (e) {
	return e && e.statusCode === 403;
}


export default React.createClass({
	displayName: 'Context',

	propTypes: {
		contentPackage: React.PropTypes.object,
		item: React.PropTypes.object,
		className: React.PropTypes.string
	},


	getInitialState () {
		return {
			loading: true
		};
	},


	componentDidMount () {
		this.updateContext(this.props.item);
	},


	componentWillReceiveProps (nextProps) {
		let {item} = nextProps;
		if (this.props.item !== item) {
			this.updateContext(item);
		}
	},


	componentDidUpdate (_, state) {
		let {error} = this.state;
		if (error && !is403(error) && error !== state.error) {
			logger.error(error);
		}
		this.focusApplicableRange();
	},


	updateContext (item) {
		this.setState({error: null, found: false, loading: true, scoped: false, fragment: false});

		item.getContextData()
			.then(x => x instanceof PageInfo ?
				this.setPageContext(item, x) :
				this.setWidgetContainerContext(item, x)
			)
			.catch(error => this.setState({error, loading: false}));
	},


	setPageContext (item, pageInfo) {
		getPageContent(pageInfo)
			.then(x => new PageDescriptor(x.pageInfo.getID(), x))
			.then(x => {
				let pageId = x.getID();
				let context = React.createElement(Content, {
					page: x,
					pageId,
					onContentReady: () => this.setState({contextReady: true})
				});

				this.setState({loading: false, fragment: true, context, pageId});
			});
	},


	setWidgetContainerContext (_, object) {
		let {item, contentPackage} = this.props;
		let props = {
			record: object,
			applicableRange: item.applicableRange,
			contentPackage
		};

		try {
			let widget = getWidget(object, undefined, props);
			let {type = {}} = widget || {};

			let context;
			try {
				context = type.interactiveInContext ? widget : ReactDOMServer.renderToStaticMarkup(widget);
			} catch(e) {
				logger.warn('Oops', e.stack || e.message || e);
			}

			this.setState({
				loading: false,
				fragment: false,
				scoped: true,
				context
			});
		} catch (error) {
			this.setState({
				loading: false,
				fragment: false,
				scoped: true,
				error
			});
		}
	},


	findApplicableRange () {
		let {item} = this.props;
		let {found, fragment, pageId, contextReady} = this.state;

		const {root} = this;
		if (!root || found || !fragment || !contextReady) {
			return !!found;
		}

		let Annotation = getAnnotation(item);
		let renderable = new Annotation(item, {
			getContentNode: () => root,
			getContentNodeClean: () => root,
			getPageID: () => pageId
		});


		renderable.render();

		let range = renderable.getRange();
		if (range) {
			let s = document.createElement('span');
			s.setAttribute('class', 'focus-context-here');
			range.insertNode(s);
			found = renderable;
		} else {
			logger.warn('Could not insert focus node');
		}

		let node = root.querySelector('#NTIContent');
		if (node) {
			//we can't insert this into the dom without causing problems. There may be other instances, so
			//we need to remove the ID before it goes into the dom.
			node.removeAttribute('id');
		}

		if (range) {
			this.setState({found});
		}

		return !!found;
	},


	focusApplicableRange () {
		let {root: node} = this;
		if (node && this.findApplicableRange()) {


			let focus = node.querySelector('.focus-context-here');

			node = node.firstChild;//this is what scrolls.

			if (focus && node.scrollHeight > node.offsetHeight) {
				// logger.log('TODO: ensure focus node', focus, 'is positioned into view.');
				let r = focus.getBoundingClientRect();
				let r2 = node.getBoundingClientRect();
				let approxOneLineHeight = 16;

				//if the focus node is completely below the bottom of the view, OR
				//if the top is in the lower 70% of the view...
				if (r.top > r2.bottom || ((r2.bottom - r.top) / r2.height) < 0.7 ) {
					node.scrollTop = (r.top - r2.top - approxOneLineHeight);
				}
			}
		}
	},


	attachRef (ref) { this.root = ref; },
	attachWRef (ref) { this.widget = ref; },


	render () {
		let {error, loading, scoped, fragment, context} = this.state;
		let {item, className: cls} = this.props;
		let className = cx('discussion-context', cls, {scoped, fragment});
		let props = {className};

		return loading
			? ( <div {...props}><Loading/></div> )
			: error
				? (is403(error)
					? ( <ContentAcquirePrompt {...props} relatedItem={item} data={error}/> )
					: ( null )
				)
				: (typeof context === 'string')
					? ( <div ref={this.attachRef} {...props} {...rawContent(context)}/> )
					: (
						<div ref={this.attachRef} {...props}>
						{
							React.createElement(context.type,
								Object.assign({}, context.props, {ref: this.attachWRef}))
						}
						</div>
					);
	}
});
