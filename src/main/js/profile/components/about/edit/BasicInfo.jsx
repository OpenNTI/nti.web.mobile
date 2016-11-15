import React from 'react';

import cx from 'classnames';

import {Editor, Panel} from 'modeled-content';

import {scoped} from 'nti-lib-locale';

const TYPE_OVERRIDE = {email: 'email'};

const TEXT_FIELDS = [
	'realname',
	'alias',
	'email',
	'location',
	'home_page',
	'facebook',
	'linkedIn',
	'twitter',
	'googlePlus'
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

		schema: React.PropTypes.object,

		error: React.PropTypes.object
	},


	attachAboutRef (x) { this.about = x; },


	getInitialState () {
		return {errors: {}};
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


	validate () {
		const {schema} = this.props;
		const errors = {};
		for(let name of TEXT_FIELDS) {
			const input = this[name];
			if (!isReadOnly(schema, name) && isRequired(schema, name) && input && Editor.isEmpty(input.value)) {
				errors[name] = true;
			}
		}
		this.setState({errors});
		return Object.keys(errors).length === 0;
	},

	render () {
		const {state, props: {schema, error}} = this;

		return (
			<fieldset>
				<div>
					<label>{t('about')}</label>
					{isReadOnly(schema, 'about') ? (
						<Panel body={state.about}/>
					) : (
						<Editor ref={this.attachAboutRef}
							className={cx({required: isRequired(schema, 'about')})}
							allowInsertImage={false}
							initialValue={state.about}
							/>
					)}
				</div>

				{TEXT_FIELDS.map(name => (
					<div key={name} className={cx({'read-only-field': isReadOnly(schema, name)})}>
						<label>{t(name)}</label>
						{isReadOnly(schema, name) ? (
							<div>{state[name]}</div>
						) : (
							<input type={TYPE_OVERRIDE[name] || 'text'} name={name}
								// ref={r => this[name] = r}
								value={state[name] || ''}
								onChange={this.onChange}
								className={cx({
									'required': isRequired(schema, name),
									'error': error && error.field === name || state.errors[name]
								})}
								required={isRequired(schema, name)}
								/>
						)}
					</div>
				))}

			</fieldset>
		);
	},


	getValue () {
		return Object.assign({}, this.state, {about: this.about.getValue()});
	}
});
