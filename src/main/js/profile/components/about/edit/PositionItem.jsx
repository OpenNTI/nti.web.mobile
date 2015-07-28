import React from 'react';
import Editor from 'modeled-content/components/Editor';

export default React.createClass({
	displayName: 'EducationItem',

	propTypes: {
		item: React.PropTypes.object.isRequired
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

		for(let field of ['companyName', 'title', 'startYear', 'endYear', 'description']) {
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

		let {companyName, title, startYear, endYear, description} = this.state || {};

		return (
			<fieldset className="educational-experience">
				<div>
					<label className="required">Company Name</label>
					<input type="text" name="companyName" className="required" required
						value={companyName} onChange={this.onChange} />
				</div>

				<div>
					<label>Title</label>
					<input type="text" name="title" value={title} onChange={this.onChange} />
				</div>

				<div className="position-years">

					<div>
						<label>Start Year</label>
						<input type="number" name="startYear" value={startYear} onChange={this.onChange} />
					</div>

					<div>
						<label>End Year</label>
						<input type="number" name="endYear" value={endYear} onChange={this.onChange} />
					</div>
				</div>

				<label>Description</label>
				<Editor className="description" allowInsertImage={false} value={description} onChange={this.editorChange} />
			</fieldset>
		);
	},


	getValue () {
		let {state} = this;
		let value = {};
		let input = Object.assign({}, this.props.item);

		for (let field of Object.keys(state)) {
			let v = state[field];
			delete input[field];

			if (v && !Editor.isEmpty(v)) {
				value[field] = Array.isArray(v) ? v : v.trim ? v.trim() : v;
			}
		}

		return Object.keys(value).length > 0
			? Object.assign({}, input, value)
			: null;
	}
});
