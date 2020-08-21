import './Part.scss';
import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import createReactClass from 'create-react-class';
import {StoreEventsMixin} from '@nti/lib-store';
import {rawContent} from '@nti/lib-commons';

import Store from '../Store';
import {isAssignment} from '../utils';
import {
	HELP_VIEW_HINT,
	HELP_VIEW_SOLUTION
} from '../Constants';

import {containerClass, getInputWidget} from './input-types';
import {getSolutionWidget} from './solution-types';
import WordBank from './WordBank';
import Content from './Content';


export default createReactClass({
	displayName: 'Part',
	mixins: [StoreEventsMixin],

	propTypes: {
		index: PropTypes.number.isRequired,
		part: PropTypes.object.isRequired,
		viewerIsAdministrative: PropTypes.bool,

		children: PropTypes.any
	},


	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'synchronizeFromStore'
	},


	attachRef (x) { this.container = x; },


	getInitialState () {
		return {
			helpVisible: false,
			activeHint: -1
		};
	},


	synchronizeFromStore () {
		const {part} = this.props;

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
		const {children, part, index, viewerIsAdministrative} = this.props;
		const {content, wordbank} = part || {};
		const {helpVisible} = this.state;

		const css = cx('form-input', {
			'hidden': helpVisible,
			'administrative': viewerIsAdministrative
		}, containerClass(part));


		return (
			<div className="question-part">
				<Content className="part-content" content={content}/>
				{wordbank && (
					<WordBank record={wordbank} disabled={viewerIsAdministrative}/>
				)}
				<div ref={this.attachRef}>
					<div className={css}>
						{getInputWidget(part, index)}
					</div>
					{helpVisible ? this.renderHelpView() : (
						<>
							{children}
							{this.renderHelpButton()}
						</>
					)}
				</div>
			</div>
		);
	},


	renderHelpButton (label) {
		const {part} = this.props;
		const {helpVisible} = this.state;
		const hints = part && Store.getHints(part);
		const solution = part && Store.getSolution(part);
		let handler = null;

		if (helpVisible) {
			handler = this.onCloseHelp;
		}
		else {

			if (solution && (Store.isSubmitted(part) || isAssignment(part))) {
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


	renderHelpView () {
		const map = {
			[HELP_VIEW_HINT]: this.renderHint,
			[HELP_VIEW_SOLUTION]: this.renderSolution
		};

		const handler = map[this.state.helpVisible];
		if (handler) {
			return handler();
		}
	},


	renderHint () {
		const part = this.props.part || {};
		const hint = ((part.hints || [])[this.state.activeHint] || {}).value || '';

		return (
			<div className="part-help hint">
				<a href="#" className="close" onClick={this.onCloseHelp}>x</a>
				<div className="hint" {...rawContent(hint)}/>
				{this.renderHelpButton('Hide Hint')}
			</div>
		);
	},


	renderSolution () {
		const {index, part} = this.props;

		return (
			<div className="part-help solution">
				<a href="#" className="close" onClick={this.onCloseHelp}>x</a>
				{getSolutionWidget(part, index)}

				{this.renderHelpButton('Hide Solution')}
			</div>
		);
	}
});
