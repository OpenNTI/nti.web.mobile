import React from 'react';
import Card from '../Card';
import Editor from 'modeled-content/components/Editor';
import RedirectToProfile from '../../mixins/RedirectToProfile';
import Link from 'common/components/ActiveLink';
import Education from './edit/Education';
import Positions from './edit/Positions';

export default React.createClass({
	displayName: 'Edit',

	mixins: [RedirectToProfile],

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
		this.valueChanged(name, value);

	},

	valueChanged(name, value) {
		// set empty strings to null
		let v = value && Array.isArray(value) || value.trim().length > 0 ? value : null;
		console.debug(name, value);
		let newValues = Object.assign({}, this.state.newValues, { [name]: v });
		this.setState({
			newValues
		});
	},

	save () {
		let {newValues} = this.state;
		let {entity} = this.props;
		entity.save(newValues)
			.then( () => this.redirectToProfile());
	},

	render () {

		let {entity} = this.props;

		return (
			<div className="profile-edit">
				<ul className="profile-cards">
					<Card className="about" title="About">
						<label>Write something about yourself</label>
						<Editor allowInsertImage={false} value={entity.about}
							ref="about"
							onChange={this.editorChange.bind(this, 'about')}
						/>
						<div>
							<label>Email</label>
							<input defaultValue={entity.email}
								ref="email"
								onChange={this.onChange}
								name="email"

							/>
						</div>
						<div>
							<label>Location</label>
							<input defaultValue={entity.location}
								ref="location"
								onChange={this.onChange}
								name="location"

							/>
						</div>
						<div>
							<label>Homepage</label>
							<input defaultValue={entity.home_page}
								ref="home_page"
								onChange={this.onChange}
								name="home_page"

							/>
						</div>
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
					<Card className="education" title="Education">
						<Education items={entity.education} onChange={this.valueChanged.bind(this, 'education')} />
					</Card>
					<Card className="positions" title="Positions">
						<Positions items={entity.positions} onChange={this.valueChanged.bind(this, 'positions')} />
					</Card>
				</ul>
				<div className="controls buttons">
					<Link href="/" className="button">Cancel</Link>
					<button onClick={this.save}>Save</button>
				</div>
			</div>
		);
	}
});
