import React from 'react';
import cx from 'classnames';

import Logger from 'nti-util-logger';

import Loading from 'common/components/Loading';
import ContextAccessor from 'common/mixins/ContextAccessor';
import t from 'common/locale';

import {Editor} from 'modeled-content';

const logger = Logger.get('content:components:discussions:ReplyEditor');

export default React.createClass({
	displayName: 'ReplyEditor',
	mixins: [ContextAccessor],


	propTypes: {
		item: React.PropTypes.object,

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
		let value = this.refs.editor.getValue();
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

		let {item, onSubmitted} = this.props;
		let {context} = this.state;
		let value = this.refs.editor.getValue();

		if (!item || !context || Editor.isEmpty(value)) {
			return;
		}

		let scopes = context.map(x=> x.scope).filter(x=> x);

		this.setState({busy: true});

		item.postReply(value, scopes)
			.then(()=> onSubmitted())
			.catch(er=> {
				//is there a message to display?
				logger.error(er);
			})
			.then(()=> this.isMounted() && this.setState({busy: false}));

	},


	render () {
		let {busy, context, value} = this.state;

		let disabled = !context || Editor.isEmpty(value);

		return (
			<div className={cx('discussion-reply-editor editor', {busy})}>
				<Editor ref="editor" value={value} onChange={this.onChange} onBlur={this.onChange}>
					<button onClick={this.onCancel} className={'cancel'}>{t('BUTTONS.cancel')}</button>
					<button onClick={this.onSubmit} className={cx('save', {disabled})}>{t('BUTTONS.save')}</button>
				</Editor>

				{busy ? ( <Loading message="Saving..."/> ) : null}
			</div>
		);
	}
});
