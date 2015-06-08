import React from 'react';

import {getModel} from 'nti.lib.interfaces';

import Loading from 'common/components/TinyLoader';

import Content from '../Content';
import {select as getAnnotation} from '../viewer-parts/annotations';

import {getPageContent} from '../../Actions';
import PageDescriptor from '../../PageDescriptor';

const PageInfo = getModel('pageinfo');

export default React.createClass({
	displayName: 'Context',

	propTypes: {
		item: React.PropTypes.object
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


	componentDidUpdate () {
		let node = React.findDOMNode(this);
		if (node) {
			let focus = node.querySelector('.fucus-context-here');
			if (focus && node.scrollHeight > node.offsetHeight) {
				console.log('TODO: ensure focus node', focus, 'is positioned into view.');
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


	updateContext (item) {
		this.setState({loading: true});
		item.getContextData()
			.then(x => x instanceof PageInfo ?
				this.setPageContext(item, x) :
				this.setWidgetContainerContext(item, x)
			);
	},


	setPageContext (item, pageInfo) {
		let Annotation = getAnnotation(item);

		getPageContent(pageInfo)
			.then(x => new PageDescriptor(x.pageInfo.getID(), x))
			.then(x => {

				let frag = document.createDocumentFragment();
				let root = frag.appendChild(document.createElement('div'));

				root.innerHTML = React.renderToStaticMarkup(
					React.createElement(Content, {
						id: 'NTIContent',
						page: x,
						pageId: x.getID()
					}));


				let renderable = new Annotation(item, {
					getContentNode: () => root,
					getContentNodeClean: () => root,
					getPageID: () => x.getID()
				});


				if (!renderable.render()) {
					console.warn('Could not render annotation into context');
				}

				let range = renderable.getRange();
				if (range) {
					let s = document.createElement('span');
					s.setAttribute('class', 'fucus-context-here');
					range.insertNode(s);
				} else {
					console.warn('Could not insert focus node');
				}

				//we can't insert this into the dom without causing problems. There may be other instances, so
				//we need to remove the ID before it goes into the dom.
				let node = frag.getElementById('NTIContent');
				if (node) {
					node.removeAttribute('id');
				}

				this.setState({loading: false, context: root.innerHTML});
			});
	},


	setWidgetContainerContext (_, object) {
		console.log('?', object);
	},


	render () {
		let {loading, context} = this.state;
		return (
			<div className="context">
				{loading ? ( <Loading/> ) : (
					<div dangerouslySetInnerHTML={{__html: context}}/>
				)}
			</div>
		);
	}
});
