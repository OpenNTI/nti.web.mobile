import './Context.scss';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOMServer from 'react-dom/server';
import cx from 'classnames';
import Logger from '@nti/util-logger';
import {getModel} from '@nti/lib-interfaces';
import {Loading} from '@nti/web-commons';
import {rawContent} from '@nti/lib-commons';
import {scoped as locale} from '@nti/lib-locale';
import {getPageContent, getGeneratedPageInfo, PageDescriptor} from '@nti/lib-content-processing';
import {Viewer} from '@nti/web-discussions';

import GotoItem from 'common/components/GotoItem';
import ContentAcquirePrompt from 'catalog/components/ContentAcquirePrompt';

import {select as getAnnotation} from '../viewer-parts/annotations';
import Content from '../Content';
import {getWidget} from '../widgets';


const logger = Logger.get('content:components:discussions:Context');

const t = locale('activity.item', {
	goto: 'Read More'
});

const PageInfo = getModel('pageinfo');
const Survey = getModel('nasurvey');


function is403 (e) {
	return e && e.statusCode === 403;
}


class DiscussionContext extends React.Component {
	static displayName = 'Context';

	static propTypes = {
		contentPackage: PropTypes.object,
		item: PropTypes.object,
		className: PropTypes.string
	};

	state = {
		loading: true
	};

	componentDidMount () {
		this.updateContext();
	}

	componentWillUnmount () {
		this.setState = () => {};
	}

	componentDidUpdate ({item}, state) {
		let {error} = this.state;

		if (this.props.item !== item) {
			this.updateContext();
		}

		if (error && !is403(error) && error !== state.error) {
			logger.error(error);
		}

		this.focusApplicableRange();
	}

	updateContext = async ({item} = this.props) => {
		this.setState({error: null, found: false, loading: true, scoped: false, fragment: false});

		try {
			let data = await item.getContextData();

			if (data instanceof Survey) {
				data = await getGeneratedPageInfo(data);
			}

			if(data instanceof PageInfo) {
				this.setPageContext(data);
			}
			else {
				this.setWidgetContainerContext(data);
			}
		}
		catch(error) {
			this.setState({error, loading: false});
		}
	};

	setPageContext = async (pageInfo) => {
		const pageContent = await getPageContent(pageInfo);
		const descriptor = new PageDescriptor(pageContent.pageInfo.getID(), pageContent);

		const pageId = descriptor.getID();
		const context = React.createElement(Content, {
			page: descriptor,
			pageId,
			onContentReady: () => this.setState({contextReady: true})
		});

		this.setState({loading: false, fragment: true, context, pageId});

	};

	setWidgetContainerContext = (object) => {
		let {item, contentPackage} = this.props;
		let props = {
			record: object,
			applicableRange: item.applicableRange,
			contentPackage,
			inContext: true
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
	};

	findApplicableRange = () => {
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
			getPageID: () => pageId,
			getPageInfoID: () => pageId
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
	};

	focusApplicableRange = () => {
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
	};

	attachRef = (ref) => { this.root = ref; };
	attachWRef = (ref) => { this.widget = ref; };

	render () {
		let {error, loading, scoped, fragment, context} = this.state;
		let {item, className: cls} = this.props;
		let className = cx('discussion-context', cls, {scoped, fragment});
		let props = {className};

		return loading
			? ( <div {...props}><Loading.Ellipse/></div> )
			: error
				? (is403(error)
					? ( <ContentAcquirePrompt {...props} relatedItem={item} data={error}/> )
					: ( null )
				)
				: (
					<div>
						{
							(typeof context === 'string')
								? ( <div ref={this.attachRef} {...props} {...rawContent(context)}/> )
								: (
									<div ref={this.attachRef} {...props}>
										{
											React.createElement(context.type,
												{...context.props, ref: this.attachWRef})
										}
									</div>
								)
						}
						<GotoItem item={item}>{t('goto')}</GotoItem>
					</div>
				);
	}
}

DiscussionContextOverride.propTypes = {
	item: PropTypes.any,
	container: PropTypes.any
};
function DiscussionContextOverride ({item, container}) {
	if (!item.isNote) { return null; }

	return (
		<DiscussionContext item={item} contextPackage={container} />
	);
}

Viewer.setContextOverride(DiscussionContextOverride);


export default DiscussionContext;
