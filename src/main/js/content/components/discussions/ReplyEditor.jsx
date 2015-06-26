import React from 'react';

import cx from 'classnames';

import {Editor} from 'modeled-content';

import Loading from 'common/components/Loading';

import t from 'common/locale';

import ContextAccessor from 'common/mixins/ContextAccessor';

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
		this.resolveContext().then(context => this.setState({context}));
		this.setState({
			value: this.props.value || null
		});
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
		let {context, value} = this.state;

		if (!item || !context || Editor.isEmpty(value)) {
			return;
		}

		let scopes = context.map(x=> x.scope).filter(x=> x);

		this.setState({busy: true});

		item.postReply(value, scopes)
			.then(()=> onSubmitted())
			.catch(er=> {
				//is there a message to display?
				console.error(er);
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
