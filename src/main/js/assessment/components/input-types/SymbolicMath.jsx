import React from 'react';

import isEmpty from 'fbjs/lib/isEmpty';

import getEventTarget from 'nti.lib.dom/lib/geteventtarget';

import Loading from 'common/components/TinyLoader';
import Error from 'common/components/Error';
import ExternalLibraryManager from 'common/mixins/ExternalLibraryManager';
import {clearLoadingFlag, setError} from 'common/utils/react-state';

import Mixin from './Mixin';


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
	//console.log('Sanitizing raw value', latex);

	latex = latex && latex.trim()
		.replace(/\s/g, '\\space ')
		.replace(/\\[;:,]/g, '\\space ');
	//console.log('Sanitized value is ', latex);

	//OK so the old version of mathquil doesn't like space
	//so lets fact it out with quad, things will have huge
	//spaces but it should mostly work
	//latex = latex.replace(/\\space/g, '\\quad');
	return latex;
}

function sanitizeMathquillOutput (v) {
	//console.log('Got raw value', v);
	v = v && v.trim()
	//	.replace(/\\quad/g, '\\space')
		.replace(/\\[;:,]/g, '\\space ')
		.replace(/\\space /g, ' ')
		.replace(/\s+/g, ' ');

	//console.log('Got clean value', v);

	return v;
}


/**
* This input type represents Symbolic Math
*/
export default React.createClass({
	displayName: 'SymbolicMath',
	mixins: [Mixin, ExternalLibraryManager],

	statics: {
		inputType: [
			'SymbolicMath'
		]
	},


	propTypes: {
		item: React.PropTypes.object
	},


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
		const {refs: {input}} = this;
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
		const {input} = this.refs;

		jQuery(input).find('textarea').focus();
	},


	onKeyUp (e) {
		stop(e);
		this.handleInteraction();
	},


	insertSymbol (e) {
		block(e);
		const {jQuery} = global;
		const {input} = this.refs;
		const symbol = getEventTarget(e, '.mathsymbol');
		console.trace('click!');
		if (!symbol || this.isSubmitted()) {
			return;
		}

		const latex = symbol.getAttribute('data-latex');

		
		jQuery(input).mathquill('cmd', latex);
		console.debug('Wrote: ' + latex);

		this.focusInput();
		this.handleInteraction();
	},


	render () {
		const {props: {item}, state: {value, loading, error}} = this;

		if (loading) {
			return ( <Loading/> );
		}

		if (error) {
			return ( <Error error="There was an error loading this question."/> );
		}


		return (
			<form className="symbolic-math" onKeyUp={this.onKeyUp} onPaste={block}>
				<div className="input" onClick={this.focusInput}>
					<span ref="input" data-label={item.answerLabel}/>
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
		console.log('Setting value to ', latex);
		return latex;
	},


	getValue () {
		const {jQuery} = global;
		const {input} = this.refs;
		const jQe = jQuery(input);
		//jQe.mouseup();
		const value = sanitizeMathquillOutput(jQe.mathquill('latex'));

		return isEmpty(value) ? null : value;
	}
});
