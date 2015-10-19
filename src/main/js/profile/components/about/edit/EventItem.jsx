import React from 'react';
import cx from 'classnames';
import {Editor} from 'modeled-content';

import {scoped} from 'common/locale';

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


	editorChange (_, newValue) {
		this.valueChanged('description', newValue);
	},

	onChange (event) {
		let {target} = event;
		let {name, value} = target;
		this.valueChanged(name, value);
	},

	valueChanged (field, newValue) {
		this.setState({[field]: newValue});
	},

	render () {
		let {schema} = this.props;
		let {state = {}} = this;
		let {startYear, endYear, description} = state;
		let [primaryField, secondaryField] = this.props.fieldNames;
		let maxYear = (new Date()).getFullYear();
		console.log(schema);
		return (
			<fieldset ref="form" className="profile-event-body">
				<div>
					<label>{t(primaryField)}</label>
					<input type="text" name={primaryField}
						className={cx({required: isRequired(schema, primaryField)})}
						required={isRequired(schema, primaryField)}
						value={state[primaryField]} onChange={this.onChange} />
				</div>

				<div className="secondary-line">
					<div>
						<label>{t(secondaryField)}</label>
						<input type="text" name={secondaryField}
							className={cx({required: isRequired(schema, secondaryField)})}
							required={isRequired(schema, secondaryField)}
							value={state[secondaryField]} onChange={this.onChange} />
					</div>

					<div className="event-years">
						<div>
							<label>Start Year</label>
							<input type="number" name="startYear"
								className={cx({required: isRequired(schema, 'startYear')})}
								required={isRequired(schema, 'startYear')}
								min="1900" max={maxYear}
								value={startYear} onChange={this.onChange}/>
						</div>

						<div>
							<label>End Year</label>
							<input type="number" name="endYear"
								className={cx({required: isRequired(schema, 'endYear')})}
								required={isRequired(schema, 'endYear')}
								min="1900" max={maxYear}
								value={endYear} onChange={this.onChange} />
						</div>
					</div>
				</div>

				<label>Description</label>
				<Editor className={cx('description', {required: isRequired(schema, 'startYear')})}
					ref="description"
					required={isRequired(schema, 'startYear')}
					allowInsertImage={false}
					value={description}
					onChange={this.editorChange} />
			</fieldset>
		);
	},


	getValue () {
		let {mimeType, item} = this.props;
		let {state} = this;
		let value = {};
		let input = Object.assign({}, item);
		input.description = this.refs.description.getValue();

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
