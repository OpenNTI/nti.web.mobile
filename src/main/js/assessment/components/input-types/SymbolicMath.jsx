import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import isEmpty from 'isempty';
import {getEventTarget} from 'nti-lib-dom';
import Logger from 'nti-util-logger';
import {Error, Loading} from 'nti-web-commons';
import {ExternalLibraryManager} from 'nti-web-client';

import {clearLoadingFlag, setError} from 'common/utils/react-state';

import Mixin, {stopEvent} from './Mixin';

const logger = Logger.get('assessment:components:input-types:SymbolicMath');

function stop (e) {
	e.stopPropagation();
}

function block (e) {
	e.preventDefault();
	stop(e);
}



function transformToMathquillInput (latex) {
	//Mathquill will produce latex it can't consume.
	//Specifically we see issues arround the spacing
	//comands \; \: and \,. We could probably patch this
	//particular issue with a small change in mathquills
	//symbol.js and cursor.js but for now this seems
	//safest and fastest
	logger.debug('Sanitizing raw value', latex);

	latex = latex && latex.trim()
		.replace(/\s/g, '\\space ')
		.replace(/\\[;:,]/g, '\\space ');
	logger.debug('Sanitized value is ', latex);

	//OK so the old version of mathquil doesn't like space
	//so lets fact it out with quad, things will have huge
	//spaces but it should mostly work
	//latex = latex.replace(/\\space/g, '\\quad');
	return latex;
}

function sanitizeMathquillOutput (v) {
	logger.debug('Got raw value', v);
	v = v && v.trim()
	//	.replace(/\\quad/g, '\\space')
		.replace(/\\[;:,]/g, '\\space ')
		.replace(/\\space /g, ' ')
		.replace(/\s+/g, ' ');

	logger.debug('Got clean value', v);

	return v;
}


/**
* This input type represents Symbolic Math
*/
export default createReactClass({
	displayName: 'SymbolicMath',
	mixins: [Mixin, ExternalLibraryManager],

	statics: {
		inputType: [
			'SymbolicMath'
		]
	},


	propTypes: {
		item: PropTypes.object
	},


	attachRef (x) { this.input = x; },


	componentWillMount () {
		this.setState({ loading:true });
	},


	componentDidMount () {
		this.ensureExternalLibrary('mathquill')
			.then(()=> clearLoadingFlag(this))
			.catch(e => setError(this, e));
	},


	componentDidUpdate () {
		const {jQuery} = global;
		const {input} = this;
		const hasQuill = !!((jQuery || {}).fn || {}).mathquill;
		const submitted = this.isSubmitted();

		if (hasQuill && input) {
			if (!input.hasAttribute('mathquill-block-id')) {
				jQuery(input).mathquill(submitted ? void 0 : 'editable');
			}
		}

	},


	focusInput () {
		const {jQuery} = global;
		const {input} = this;

		jQuery(input).find('textarea').focus();
	},


	onKeyUp (e) {
		stop(e);
		this.handleInteraction();
	},


	insertSymbol (e) {
		block(e);
		const {jQuery} = global;
		const {input} = this;
		const symbol = getEventTarget(e, '.mathsymbol');
		logger.trace('click!');
		if (!symbol || this.isSubmitted()) {
			return;
		}

		const latex = symbol.getAttribute('data-latex');


		jQuery(input).mathquill('cmd', latex);
		logger.debug('Wrote: ' + latex);

		this.focusInput();
		this.handleInteraction();
	},


	render () {
		const {props: {item}, state: {value, loading, error}} = this;

		if (loading) {
			return ( <Loading.Ellipse/> );
		}

		if (error) {
			return ( <Error error="There was an error loading this question."/> );
		}


		return (
			<form className="symbolic-math" onKeyUp={this.onKeyUp} onPaste={block} onSubmit={stopEvent}>
				<div className="input" onClick={this.focusInput}>
					<span ref={this.attachRef} data-label={item.answerLabel}>{value}</span>
				</div>
				<div className="shortcuts" onClick={this.insertSymbol}>
					<a href="#" className="mathsymbol sqrt" data-latex="\surd" title="Insert square root"/>
					<a href="#" className="mathsymbol square" data-latex="x^2" title="Insert squared"/>
					<a href="#" className="mathsymbol parens" data-latex="(x)" title="Insert parentheses"/>
					<a href="#" className="mathsymbol approx" data-latex="\approx" title="Insert approximately"/>
					<a href="#" className="mathsymbol pi" data-latex="\pi" title="Insert pi"/>
					<a href="#" className="mathsymbol leq" data-latex="\leq" title="Insert less than or equal to"/>
					<a href="#" className="mathsymbol geq" data-latex="\geq" title="Insert greater than or equal to"/>
					<a href="#" className="mathsymbol neq" data-latex="\neq" title="Insert not Equal"/>
				</div>
				<textarea value={value} className="debug"/>
			</form>
		);
	},


	processValue (value) {
		const latex = transformToMathquillInput(value);
		logger.debug('Setting value to ', latex);
		return latex;
	},


	getValue () {
		const {jQuery} = global;
		const {input} = this;
		const jQe = jQuery(input);
		//jQe.mouseup();
		const value = sanitizeMathquillOutput(jQe.mathquill('latex'));

		return isEmpty(value) ? null : value;
	}
});
