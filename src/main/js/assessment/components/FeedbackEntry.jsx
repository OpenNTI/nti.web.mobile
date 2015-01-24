import * as React from 'react/addons';

import {Editor} from 'modeled-content';
import {scoped, translate as t} from 'common/locale';

const _t = scoped('ASSESSMENT.ASSIGNMENTS.FEEDBACK');

const WHITESPACE_ENTITIES_AND_TAGS = /((<[^>]+>)|&nbsp;|[\s\r\n])+/ig;

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
	displayName: 'FeedbackEntry',

	getInitialState () {
		return {
			active: false
		};
	},


	onOpenEditor (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.setState({ active: true });
	},


	render () {
		return (
			<div className="feedback entry">
				<div className="input-area">
				{this.state.active ? this.renderEditor() : (
					<a href="#" className="placeholder" onClick={this.onOpenEditor}>{_t('entryPlaceholder')}</a>
				)}
				</div>
			</div>
		);
	},


	renderEditor () {
		var {feedback} = this.state;

		var disabled = isEmpty(feedback) ? 'disabled' : '';

		return (
			<div className="feedback editor">
				<Editor ref="editor" onChange={this.onChange} onBlur={this.onChange}/>
				<button onClick={this.onClick} className={`save ${disabled}`}>{t('BUTTONS.save')}</button>
			</div>
		);
	},


	onChange () {
		var feedback = this.refs.editor.getValue();
		this.setState({feedback});
	},


	onClick (e) {
		e.preventDefault();
		e.stopPropagation();

		var {feedback} = this.state;

		if (isEmpty(feedback)) {
			return;
		}

		console.log(this.state.feedback);
	}
});
