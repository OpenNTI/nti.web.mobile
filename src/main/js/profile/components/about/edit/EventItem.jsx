import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';
import { Editor } from 'internal/modeled-content';

const t = scoped('profile.edit.event_item', {
	school: 'School',
	degree: 'Degree',
	companyName: 'Company Name',
	title: 'Title',
});

function isRequired(schema, prop) {
	return ((schema || {})[prop] || {}).required;
}

export default class EventItem extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,

		fieldNames: PropTypes.arrayOf(PropTypes.string).isRequired,

		mimeType: PropTypes.string.isRequired,

		schema: PropTypes.object.isRequired,
	};

	state = {};

	attachPrimaryFieldRef = x => {
		this[this.props.fieldNames[0]] = x;
	};
	attachSecondaryFieldRef = x => {
		this[this.props.fieldNames[1]] = x;
	};
	attachStartYearRef = x => {
		this.startYear = x;
	};
	attachEndYearRef = x => {
		this.endYear = x;
	};
	attachDescriptionRef = x => {
		this.description = x;
	};
	componentDidMount() {
		this.setup();
	}

	componentDidUpdate = prevProps => {
		if (this.props.item !== prevProps.item) {
			this.setup();
		}
	};

	setup = (props = this.props) => {
		let { item, fieldNames } = props;
		let state = {};

		for (let field of fieldNames.concat([
			'startYear',
			'endYear',
			'description',
		])) {
			state[field] = item && item[field];
		}

		this.setState(state);
	};

	editorChange = () => {
		this.validate(); // refresh error state
	};

	onChange = event => {
		const {
			target: { name, value },
		} = event;
		this.valueChanged(name, value);
	};

	valueChanged = (field, newValue) => {
		this.validate(); // refresh error state
		this.setState({ [field]: newValue });
	};

	validate = () => {
		const {
			props: {
				fieldNames: [primaryField, secondaryField],
				schema,
			},
		} = this;
		const fields = [
			primaryField,
			secondaryField,
			'startYear',
			'endYear',
			'description',
		];
		const errors = {};
		for (let name of fields) {
			const field = this[name];
			if (
				field &&
				isRequired(schema, name) &&
				Editor.isEmpty(field.value)
			) {
				errors[name] = true;
			}
		}
		this.setState({
			errors,
		});
		return Object.keys(errors).length === 0;
	};

	render() {
		const {
			props: {
				fieldNames: [primaryField, secondaryField],
				schema,
			},
			state = {},
		} = this;
		const { startYear, endYear, description, errors = {} } = state;

		const maxYear = new Date().getFullYear();

		return (
			<fieldset className="profile-event-body">
				<div>
					<label>{t(primaryField)}</label>
					<input
						type="text"
						name={primaryField}
						ref={this.attachPrimaryFieldRef}
						className={cx({
							error: errors[primaryField],
							required: isRequired(schema, primaryField),
						})}
						required={isRequired(schema, primaryField)}
						value={state[primaryField] || ''}
						onChange={this.onChange}
					/>
				</div>

				<div className="secondary-line">
					<div>
						<label>{t(secondaryField)}</label>
						<input
							type="text"
							name={secondaryField}
							ref={this.attachSecondaryFieldRef}
							className={cx({
								error: errors[secondaryField],
								required: isRequired(schema, secondaryField),
							})}
							required={isRequired(schema, secondaryField)}
							value={state[secondaryField] || ''}
							onChange={this.onChange}
						/>
					</div>

					<div className="event-years">
						<div>
							<label>Start Year</label>
							<input
								type="number"
								name="startYear"
								ref={this.attachStartYearRef}
								className={cx({
									error: errors.startYear,
									required: isRequired(schema, 'startYear'),
								})}
								required={isRequired(schema, 'startYear')}
								min="1900"
								max={maxYear}
								value={startYear || ''}
								onChange={this.onChange}
							/>
						</div>

						<div>
							<label>End Year</label>
							<input
								type="number"
								name="endYear"
								ref={this.attachEndYearRef}
								className={cx({
									error: errors.endYear,
									required: isRequired(schema, 'endYear'),
								})}
								required={isRequired(schema, 'endYear')}
								min="1900"
								max={maxYear}
								value={endYear || ''}
								onChange={this.onChange}
							/>
						</div>
					</div>
				</div>

				<label>Description</label>
				<textarea
					ref={this.attachDescriptionRef}
					defaultValue={description}
					onChange={this.onChange}
					name="description"
					className={cx('description', {
						required: isRequired(schema, 'startYear'),
					})}
				/>
			</fieldset>
		);
	}

	getValue = () => {
		let { mimeType, item } = this.props;
		let { state } = this;
		let value = {};
		let input = { ...item };

		for (let field of Object.keys(state)) {
			let v = state[field];
			delete input[field];

			if (v && (typeof v === 'number' || !Editor.isEmpty(v))) {
				value[field] = Array.isArray(v) ? v : v.trim ? v.trim() : v;
			}
		}

		return Object.keys(value).length > 0
			? { MimeType: mimeType, ...input, ...value }
			: null;
	};
}
