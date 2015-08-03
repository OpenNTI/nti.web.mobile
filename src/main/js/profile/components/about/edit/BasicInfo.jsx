import React from 'react';

import cx from 'classnames';

import {Editor, Panel} from 'modeled-content';

import {scoped} from 'common/locale';

const TYPE_OVERRIDE = {email: 'email'};

const TEXT_FIELDS = [
	'realname',
	'alias',
	'email',
	'location',
	'home_page',
	'facebook',
	'linkedIn',
	'googlePlus',
	'twitter'
];

const t = scoped('PROFILE.EDIT');

function isReadOnly (schema, prop) {
	return ((schema || {})[prop] || {}).readonly;
}

function isRequired (schema, prop) {
	return ((schema || {})[prop] || {}).required;
}

export default React.createClass({
	displayName: 'BasicInfo',

	propTypes: {
		item: React.PropTypes.object,

		schema: React.PropTypes.object
	},


	getInitialState () {
		return {};
	},


	componentWillMount () { this.setup(); },

	componentWillReceiveProps (nextProps) {
		if (this.props.item !== nextProps.item) {
			this.setup(nextProps);
		}
	},

	setup (props = this.props) {
		let {item} = props;
		let state = {};

		for(let field of ['about'].concat(TEXT_FIELDS)) {
			state[field] = item && item[field];
		}

		this.setState(state);
	},


	onChange (e) {
		let {name, value} = e.target;

		value = Editor.isEmpty(value) ? null : value;

		this.setState({[name]: value});
	},


	onEditorChange (_, value) {
		let about = Editor.isEmpty(value) ? null : value;
		this.setState({about});
	},


	render () {
		let {state} = this;
		let {schema} = this.props;

		return (
			<fieldset ref="form">
				<div>
					<label>{t('about')}</label>
					{isReadOnly(schema, 'about') ? (
						<Panel body={state.about}/>
					) : (
						<Editor ref="about"
							className={cx({required: isRequired(schema, 'about')})}
							allowInsertImage={false}
							value={state.about}
							onChange={this.onEditorChange}/>
					)}
				</div>

				{TEXT_FIELDS.map(name => (
					<div key={name} className={cx({'read-only-field': isReadOnly(schema, name)})}>
						<label>{t(name)}</label>
						{isReadOnly(schema, name) ? (
							<div>{state[name]}</div>
						) : (
							<input type={TYPE_OVERRIDE[name] || 'text'} name={name}
								value={state[name]}
								onChange={this.onChange}
								className={cx({required: isRequired(schema, name)})}
								required={isRequired(schema, name)}
								/>
						)}
					</div>
				))}

			</fieldset>
		);
	},


	getValue () {
		return this.state;
	}
});
