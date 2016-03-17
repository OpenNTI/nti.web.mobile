import React from 'react';
import cx from 'classnames';

import Logger from 'nti-util-logger';

import Loading from 'common/components/Loading';
import ContextAccessor from 'common/mixins/ContextAccessor';
import t from 'common/locale';

import {Editor} from 'modeled-content';

const logger = Logger.get('content:components:discussions:ReplyEditor');
const getBody = x => Array.isArray(x) ? x : [x];

export default React.createClass({
	displayName: 'ReplyEditor',
	mixins: [ContextAccessor],


	propTypes: {
		item: React.PropTypes.object,
		replyTo: React.PropTypes.object,

		value: React.PropTypes.array,

		onCancel: React.PropTypes.func,

		onSubmitted: React.PropTypes.func
	},


	getInitialState () {
		return {};
	},


	componentWillMount () {
		const {value} = this.props;
		this.resolveContext().then(context => this.setState({context}));
		this.setState({ value });
	},


	componentWillReceiveProps (nextProps) {
		const {value} = nextProps;
		if (this.props.value !== value) {
			this.setState({ value });
		}
	},


	onChange () {
		let value = this.editor.getValue();
		this.setState({value});
	},

	onCancel (e) {
		e.preventDefault();
		e.stopPropagation();
		this.props.onCancel();
	},

	onSubmit (e) {
		e.preventDefault();
		e.stopPropagation();

		const {item, replyTo, onSubmitted} = this.props;
		const {context} = this.state;
		const body = getBody(this.editor.getValue());

		if ((!replyTo && !item) || !context || Editor.isEmpty(body)) {
			return;
		}

		this.setState({busy: true});

		const pendingSave = replyTo ?
			//save new reply
			replyTo.postReply(body, context.map(x=> x.scope).filter(x=> x)) :
			//or save changes to existing reply
			item.save({body});


		pendingSave
			.then(()=> onSubmitted())
			.catch(er=> {
				//is there a message to display?
				logger.error(er);
			})
			.then(()=> this.setState({busy: false}));

	},


	render () {
		let {busy, context, value} = this.state;

		let disabled = !context || Editor.isEmpty(value);

		return (
			<div className={cx('discussion-reply-editor editor', {busy})}>
				<Editor ref={x => this.editor = x} value={value} onChange={this.onChange} onBlur={this.onChange}>
					<button onClick={this.onCancel} className={'cancel'}>{t('BUTTONS.cancel')}</button>
					<button onClick={this.onSubmit} className={cx('save', {disabled})}>{t('BUTTONS.save')}</button>
				</Editor>

				{busy ? ( <Loading message="Saving..."/> ) : null}
			</div>
		);
	}
});
