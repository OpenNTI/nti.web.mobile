import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';
import { Editor, Panel } from 'internal/modeled-content';

const TYPE_OVERRIDE = { email: 'email' };

const TEXT_FIELDS = [
	'realname',
	'alias',
	'email',
	'location',
	'home_page',
	'facebook',
	'linkedIn',
	'twitter',
	'googlePlus',
];

const t = scoped('profile.edit', {
	about: 'Write something about yourself.',
	email: 'Email',
	home_page: 'Home page',
	location: 'Location',
	twitter: 'Twitter Profile',
	facebook: 'Facebook Profile',
	googlePlus: 'Google+ Profile',
	linkedIn: 'LinkedIn Profile',
	alias: 'Display Name',
	realname: 'Name',
});

function isReadOnly(schema, prop) {
	return ((schema || {})[prop] || {}).readonly;
}

function isRequired(schema, prop) {
	return ((schema || {})[prop] || {}).required;
}

export default class extends React.Component {
	static displayName = 'BasicInfo';

	static propTypes = {
		item: PropTypes.object,

		schema: PropTypes.object,

		error: PropTypes.object,
	};

	state = { errors: {} };
	attachAboutRef = x => {
		this.about = x;
	};

	componentDidMount() {
		this.setup();
	}

	componentDidUpdate(prevProps) {
		if (this.props.item !== prevProps.item) {
			this.setup();
		}
	}

	setup = (props = this.props) => {
		let { item } = props;
		let state = {};

		for (let field of ['about'].concat(TEXT_FIELDS)) {
			state[field] = item && item[field];
		}

		this.setState(state);
	};

	onChange = e => {
		let { name, value } = e.target;

		value = Editor.isEmpty(value) ? null : value;

		this.setState({ [name]: value });
	};

	validate = () => {
		const { schema } = this.props;
		const errors = {};
		for (let name of TEXT_FIELDS) {
			const input = this[name];
			if (
				!isReadOnly(schema, name) &&
				isRequired(schema, name) &&
				input &&
				Editor.isEmpty(input.value)
			) {
				errors[name] = true;
			}
		}
		this.setState({ errors });
		return Object.keys(errors).length === 0;
	};

	render() {
		const {
			state,
			props: { schema, error },
		} = this;

		return (
			<fieldset>
				<div>
					<label>{t('about')}</label>
					{isReadOnly(schema, 'about') ? (
						<Panel body={state.about} />
					) : (
						<Editor
							ref={this.attachAboutRef}
							className={cx({
								required: isRequired(schema, 'about'),
							})}
							allowInsertImage={false}
							initialValue={state.about}
						/>
					)}
				</div>

				{TEXT_FIELDS.map(name => (
					<div
						key={name}
						className={cx({
							'read-only-field': isReadOnly(schema, name),
						})}
					>
						<label>{t(name)}</label>
						{isReadOnly(schema, name) ? (
							<div>{state[name]}</div>
						) : (
							<input
								type={TYPE_OVERRIDE[name] || 'text'}
								name={name}
								// ref={r => this[name] = r}
								value={state[name] || ''}
								onChange={this.onChange}
								className={cx({
									required: isRequired(schema, name),
									error:
										(error && error.field === name) ||
										state.errors[name],
								})}
								required={isRequired(schema, name)}
							/>
						)}
					</div>
				))}
			</fieldset>
		);
	}

	getValue = () => {
		const valueOrNull = x => (!x || !x.length ? null : x);
		return {
			...this.state,
			about: valueOrNull(this.about.getValue()),
		};
	};
}
