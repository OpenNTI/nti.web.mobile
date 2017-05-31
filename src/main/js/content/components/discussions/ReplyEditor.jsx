import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import cx from 'classnames';

import Logger from 'nti-util-logger';

import {Loading} from 'nti-web-commons';
import ContextAccessor from 'common/mixins/ContextAccessor';
import t from 'nti-lib-locale';

import {Editor} from 'modeled-content';

const logger = Logger.get('content:components:discussions:ReplyEditor');
const getBody = x => Array.isArray(x) ? x : [x];

export default createReactClass({
	displayName: 'ReplyEditor',
	mixins: [ContextAccessor],


	propTypes: {
		item: PropTypes.object,
		replyTo: PropTypes.object,

		value: PropTypes.array,

		onCancel: PropTypes.func,

		onSubmitted: PropTypes.func
	},


	getInitialState () {
		return {};
	},


	componentWillMount () {
		this.setState({disabled: true});
		this.resolveContext()
			.then(context => {
				const {value} = this.props;
				this.setState({context, disabled: !context || Editor.isEmpty(value) });
			});
	},


	componentWillReceiveProps (nextProps) {
		const {value} = nextProps;
		if (this.props.value !== value) {
			this.setState({ disabled: !this.state.context || Editor.isEmpty(value) });
		}
	},


	onChange () {
		let value = this.editor.getValue();
		let disabled = !this.state.context || Editor.isEmpty(value);
		this.setState({disabled});
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
		let {busy, disabled} = this.state;

		return (
			<div className={cx('discussion-reply-editor editor', {busy})}>
				<Editor ref={x => this.editor = x} initialValue={this.props.value} onChange={this.onChange}>
					<button onClick={this.onCancel} className={'cancel'}>{t('BUTTONS.cancel')}</button>
					<button onClick={this.onSubmit} className={cx('save', {disabled})}>{t('BUTTONS.save')}</button>
				</Editor>

				{busy ? ( <Loading.Mask message="Saving..."/> ) : null}
			</div>
		);
	}
});
