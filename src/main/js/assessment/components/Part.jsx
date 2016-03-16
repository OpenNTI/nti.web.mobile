import React from 'react';
import cx from 'classnames';

import StoreEvents from 'common/mixins/StoreEvents';
import {rawContent} from 'common/utils/jsx';

import Content from './Content';
import WordBank from './WordBank';

import Store from '../Store';
import {
	HELP_VIEW_HINT,
	HELP_VIEW_SOLUTION
} from '../Constants';

import {getInputWidget} from './input-types';
import {getSolutionWidget} from './solution-types';


export default React.createClass({
	displayName: 'Part',
	mixins: [StoreEvents],

	propTypes: {
		index: React.PropTypes.number.isRequired,
		part: React.PropTypes.object.isRequired,
		viewerIsAdministrative: React.PropTypes.bool,

		children: React.PropTypes.any
	},


	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'synchronizeFromStore'
	},


	getInitialState () {
		return {
			helpVisible: false,
			activeHint: -1
		};
	},


	synchronizeFromStore () {
		let {part} = this.props;

		if (this.state.helpVisible && !Store.isSubmitted(part)) {
			this.onCloseHelp();
		}
		this.forceUpdate();

	},


	componentDidUpdate (prevProps, prevState) {
		if (this.state.helpVisible !== prevState.helpVisible) {
			const {container: node} = this;
			if (node.getBoundingClientRect().top < 0) {
				node.scrollIntoView();
			}
		}
	},


	onShowSolution (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.setState({
			helpVisible: HELP_VIEW_SOLUTION
		});
	},


	onShowHint (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		let hintCount = (Store.getHints(this.props.part) || []).length;

		this.setState({
			helpVisible: HELP_VIEW_HINT,
			activeHint: (this.state.activeHint + 1) % hintCount
		});
	},


	onCloseHelp (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.setState({helpVisible: false});
	},


	render () {
		let {part, index, viewerIsAdministrative} = this.props;
		let {content, wordbank} = part || {};
		let {helpVisible} = this.state;

		let css = cx('form-input', {
			'hidden': helpVisible,
			'administrative': viewerIsAdministrative
		});


		return (
			<div className="question-part">
				<Content className="part-content" content={content}/>
				{wordbank && (
					<WordBank record={wordbank} disabled={viewerIsAdministrative}/>
				)}
				<div ref={x => this.container = x}>
					<div className={css}>
						{getInputWidget(part, index)}
					</div>
					{this.renderChildren()}
					{
						helpVisible ?
							this.renderHelpView() :
							this.renderHelpButton()
					}
				</div>
			</div>
		);
	},


	renderHelpButton (label) {
		let {part} = this.props;
		let {helpVisible} = this.state;
		let isSubmitted = part && Store.isSubmitted(part);
		let isAdministrative = part && Store.isAdministrative(part);
		let hints = part && Store.getHints(part);
		let solution = part && Store.getSolution(part);
		let handler = null;

		if (helpVisible) {
			handler = this.onCloseHelp;
		}
		else {
			//Submitted AND solution...
			if (solution && (isSubmitted || isAdministrative)) {
				handler = this.onShowSolution;
				label = 'Show Solution';
			}
			else if (hints) {
				handler = this.onShowHint;
				label = 'Show Hint';
			}
		}

		return !handler ? null : (
			<div className="button-box text-right">
				<a href="#" className="help-link" onClick={handler}>{label}</a>
			</div>
		);
	},


	renderChildren () {
		let {helpVisible} = this.state;
		let {children} = this.props;

		if (helpVisible) { return; }

		return React.Children.map(children, x=>React.cloneElement(x));
	},


	renderHelpView () {
		let map = {
			[HELP_VIEW_HINT]: this.renderHint,
			[HELP_VIEW_SOLUTION]: this.renderSolution
		};

		let handler = map[this.state.helpVisible];
		if (handler) {
			return handler();
		}
	},


	renderHint () {
		let part = this.props.part || {};
		let hint = ((part.hints || [])[this.state.activeHint] || {}).value || '';

		return (
			<div className="part-help hint">
				<a href="#" className="close" onClick={this.onCloseHelp}>x</a>
				<div className="hint" {...rawContent(hint)}/>
				{this.renderHelpButton('Hide Hint')}
			</div>
		);
	},


	renderSolution () {
		let {index, part} = this.props;

		return (
			<div className="part-help solution">
				<a href="#" className="close" onClick={this.onCloseHelp}>x</a>
				{getSolutionWidget(part, index)}

				{this.renderHelpButton('Hide Solution')}
			</div>
		);
	}
});
