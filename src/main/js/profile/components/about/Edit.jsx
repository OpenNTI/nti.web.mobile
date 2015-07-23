import React from 'react';
import Card from '../Card';
import Editor from 'modeled-content/components/Editor';

export default React.createClass({
	displayName: 'Edit',

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			newValues: {}
		};
	},

	editorChange(ref, oldValue, newValue) {
		console.debug(ref, newValue);
		this.valueChanged(ref, newValue);
	},

	onChange (event) {
		let {target} = event;
		let {name, value} = target;
		console.debug(name, value);
		this.valueChanged(name, value);

	},

	valueChanged(name, value) {
		let {newValues} = this.state;
		let nv = Object.assign({}, newValues, { [name]: value });
		console.debug(nv);
		this.setState({
			newValues: nv
		});
	},

	save () {
		let {newValues} = this.state;
		let {entity} = this.props;
		entity.save(newValues)
			.then(result => console.debug(result));
	},

	render () {

		let {entity} = this.props;

		return (
			<div>
				<ul className="profile-cards">
					<Card className="about" title="About">
						<Editor allowInsertImage={false} value={entity.about}
							ref="about"
							onChange={this.editorChange.bind(this,'about')}
						/>
						<div>
							<label>Twitter</label>
							<input defaultValue={entity.twitter}
								ref="twitter"
								onChange={this.onChange}
								name="twitter"

							/>
						</div>
						<div>
							<label>Facebook</label>
							<input defaultValue={entity.facebook}
								ref="facebook"
								onChange={this.onChange}
								name="facebook"

							/>
						</div>
						<div>
							<label>Google Plus</label>
							<input defaultValue={entity.googlePlus}
								ref="googlePlus"
								onChange={this.onChange}
								name="googlePlus"

							/>
						</div>
						<div>
							<label>LinkedIn</label>
							<input defaultValue={entity.linkedIn}
								ref="linkedIn"
								onChange={this.onChange}
								name="linkedIn"

							/>
						</div>
					</Card>
					<Card className="education" title="Education">Education</Card>
					<Card className="positions" title="Positions">Positions</Card>
				</ul>
				<div className="controls buttons">
					<button onClick={this.save}>Save</button>
				</div>
			</div>
		);
	}
});
