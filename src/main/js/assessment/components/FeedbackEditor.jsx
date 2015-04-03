import React from 'react';
import {Editor} from 'modeled-content';

import Loading from 'common/components/Loading';

import {translate as t} from 'common/locale';

const WHITESPACE_ENTITIES_AND_TAGS = /((<[^>]+>)|&nbsp;|[\s\r\n])+/ig;

//TODO: combine this into nti.lib.domjs's isValueEmpty
function isEmpty(html) {
	if (!Array.isArray(html)) {
		html = [html];
	}

	// This filter fn will return true if:
	// 1) x is not 'null' AND:
	// 2a) x is not a string OR
	// 2b) is a string that does not reduce to lenth 0
	let empties = x=>
	x && (typeof x !== 'string' || x.replace(WHITESPACE_ENTITIES_AND_TAGS,'').length);

	return html.filter(empties).length === 0;
}

export default React.createClass({
	displayName: 'FeedbackEditor',

	propTypes: {
		onCancel: React.PropTypes.func,
		onSubmit: React.PropTypes.func.isRequired,
		value: React.PropTypes.array
	},


	componentWillMount () {
		this.setState({
			value: this.props.value || null
		});
	},


	render () {
		var {value} = this.state;

		var disabled = isEmpty(value) ? 'disabled' : '';
		var busy = this.state.busy ? 'busy' : '';

		return (
			<div className={`feedback editor ${busy}`}>
				<Editor ref="editor" value={value} onChange={this.onChange} onBlur={this.onChange}/>
				<div className="buttons">
					<button onClick={this.onCancel} className={`cancel`}>{t('BUTTONS.cancel')}</button>
					<button onClick={this.onClick} className={`save ${disabled}`}>{t('BUTTONS.save')}</button>
				</div>
				{this.state.busy?
					<Loading message="Saving..."/> : null}
			</div>
		);
	},


	onChange () {
		var value = this.refs.editor.getValue();
		this.setState({value});
	},


	onCancel (e) {
		e.preventDefault();
		e.stopPropagation();
		this.props.onCancel();
	},


	onClick (e) {
		e.preventDefault();
		e.stopPropagation();

		var {value} = this.state;

		if (isEmpty(value)) {
			return;
		}

		this.setState({busy: true});
		var thenable = this.props.onSubmit(value);
		if (!thenable) {
			console.error('onSubmit callback did not return a thenable, this component will never leave the busy state.');
			return;
		}

		thenable
			.catch(()=>{})
			.then(()=>{
				if (this.isMounted()) {
					this.setState({busy:false});
				}
			});
	}
});
