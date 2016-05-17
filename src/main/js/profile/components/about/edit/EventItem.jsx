import React from 'react';
import cx from 'classnames';
import {Editor} from 'modeled-content';

import {scoped} from 'nti-lib-locale';

const t = scoped('PROFILE.EDIT.EVENT_ITEM');

function isRequired (schema, prop) {
	return ((schema || {})[prop] || {}).required;
}

export default React.createClass({
	displayName: 'EducationItem',

	propTypes: {
		item: React.PropTypes.object.isRequired,

		fieldNames: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,

		mimeType: React.PropTypes.string.isRequired,

		schema: React.PropTypes.object.isRequired
	},


	componentWillMount () { this.setup(); },

	ccomponentWillReceiveProps (nextProps) {
		if (this.props.item !== nextProps.item) {
			this.setup(nextProps);
		}
	},

	setup (props = this.props) {
		let {item, fieldNames} = props;
		let state = {};

		for(let field of fieldNames.concat(['startYear', 'endYear', 'description'])) {
			state[field] = item && item[field];
		}

		this.setState(state);
	},


	editorChange () {
		this.validate(); // refresh error state
	},


	onChange (event) {
		const {target: {name, value}} = event;
		this.valueChanged(name, value);
	},


	valueChanged (field, newValue) {
		this.validate(); // refresh error state
		this.setState({[field]: newValue});
	},

	validate () {
		const {props: {fieldNames: [primaryField, secondaryField], schema}} = this;
		const fields = [primaryField, secondaryField, 'startYear', 'endYear', 'description' ];
		const errors = {};
		for(name of fields) {
			const field = this[name];
			if (field && isRequired(schema, name) && Editor.isEmpty(field.value)) {
				errors[name] = true;
			}
		}
		this.setState({
			errors
		});
		return Object.keys(errors).length === 0;
	},

	render () {
		const {props: {fieldNames: [primaryField, secondaryField], schema}, state = {}} = this;
		const {startYear, endYear, description, errors = {}} = state;

		const maxYear = (new Date()).getFullYear();

		return (
			<fieldset className="profile-event-body">
				<div>
					<label>{t(primaryField)}</label>
					<input type="text" name={primaryField}
						ref={c => this[primaryField] = c}
						className={cx({error: errors[primaryField], required: isRequired(schema, primaryField)})}
						required={isRequired(schema, primaryField)}
						value={state[primaryField]} onChange={this.onChange} />
				</div>

				<div className="secondary-line">
					<div>
						<label>{t(secondaryField)}</label>
						<input type="text" name={secondaryField}
							ref={c => this[secondaryField] = c}
							className={cx({error: errors[secondaryField], required: isRequired(schema, secondaryField)})}
							required={isRequired(schema, secondaryField)}
							value={state[secondaryField]} onChange={this.onChange} />
					</div>

					<div className="event-years">
						<div>
							<label>Start Year</label>
							<input type="number" name="startYear"
								ref={c => this.startYear = c}
								className={cx({error: errors.startYear, required: isRequired(schema, 'startYear')})}
								required={isRequired(schema, 'startYear')}
								min="1900" max={maxYear}
								value={startYear} onChange={this.onChange}/>
						</div>

						<div>
							<label>End Year</label>
							<input type="number" name="endYear"
								ref={c => this.endYear = c}
								className={cx({error: errors.endYear, required: isRequired(schema, 'endYear')})}
								required={isRequired(schema, 'endYear')}
								min="1900" max={maxYear}
								value={endYear} onChange={this.onChange} />
						</div>
					</div>
				</div>

				<label>Description</label>
				<Editor className={cx('description', {required: isRequired(schema, 'startYear')})}
					ref={c => this.description = c}
					required={isRequired(schema, 'startYear')}
					allowInsertImage={false}
					initialValue={description}
					onChange={this.editorChange} />
			</fieldset>
		);
	},


	getValue () {
		let {mimeType, item} = this.props;
		let {state} = this;
		let value = {};
		let input = Object.assign({}, item);
		input.description = this.description.getValue();

		for (let field of Object.keys(state)) {
			let v = state[field];
			delete input[field];

			if (v && !Editor.isEmpty(v)) {
				value[field] = Array.isArray(v) ? v : v.trim ? v.trim() : v;
			}
		}

		return Object.keys(value).length > 0
			? Object.assign({MimeType: mimeType}, input, value)
			: null;
	}
});
