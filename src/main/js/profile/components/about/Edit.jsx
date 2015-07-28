import React from 'react';
import Card from '../Card';
import Editor from 'modeled-content/components/Editor';
import RedirectToProfile from '../../mixins/RedirectToProfile';
import Link from 'common/components/ActiveLink';
import Education from './edit/Education';
import Positions from './edit/Positions';
import Interests from './edit/Interests';
import Loading from 'common/components/Loading';
import {scoped} from 'common/locale';

let t = scoped('ERROR_MESSAGES');

const ERROR_REQUIRED_MISSING = 'RequiredMissing';

export default React.createClass({
	displayName: 'Edit',

	mixins: [RedirectToProfile],

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			newValues: {},
			error: null
		};
	},

	componentWillMount: function() {
		this.setUpEditObject();
	},

	componentWillReceiveProps: function(nextProps) {
		this.setUpEditObject(nextProps);
	},

	setUpEditObject (props = this.props) {
		if (props.entity) {
			let editObject = this.props.entity.getData();
			for (let key of Object.keys(editObject)) {
				if (editObject[key] == null) {
					delete editObject[key];
				}
			}
			this.setState({
				editObject
			});
		}
	},

	editorChange(ref, oldValue, newValue) {
		this.valueChanged(ref, newValue);
	},

	onChange (event) {
		let {target} = event;
		let {name, value} = target;
		this.valueChanged(name, value);

	},

	valueChanged(name, value) {
		// set empty strings to null
		let v = (value && (Array.isArray(value) || value.trim().length > 0)) ? value : null;
		let {editObject, newValues} = this.state;

		newValues = Object.assign({}, newValues, { [name]: v });
		editObject = Object.assign({}, editObject, newValues);

		console.time('Form Render Update');
		this.setState({editObject, newValues}, () => {
			console.timeEnd('Form Render Update');
		});
	},

	save (e) {
		e.preventDefault();
		this.setState({
			busy: true
		});
		let {newValues} = this.state;
		let {entity} = this.props;
		entity.save(newValues)
		.then(
			() => {
				this.redirectToProfile();
			},
			(reason) => {
				this.setState({
					error: reason,
					busy: false
				});
			}
		);
	},

	errorMessage(error) {
		if (error.code === ERROR_REQUIRED_MISSING) {
			let localizedFieldName = t(`FIELDNAMES.${error.field}`, {fallback: error.field});
			return t('requiredField', {field: localizedFieldName});
		}
		return (error || {}).message || `An unrecognized error occurred: ${error.code}.`;
	},

	render () {

		if (this.state.busy) {
			return <Loading />;
		}

		let {editObject, error} = this.state;

		return (
			<div className="profile-edit">
				<form onSubmit={this.save}>
					<ul className="profile-cards">
						{error && <Card className="error">{this.errorMessage(error)}</Card>}
						<Card className="about" title="About">
							<label>Write something about yourself</label>
							<Editor allowInsertImage={false} value={editObject.about}
								ref="about"
								onChange={this.editorChange.bind(this, 'about')}
							/>
							<div>
								<label>Email</label>
								<input
									type="email"
									defaultValue={editObject.email}
									ref="email"
									onChange={this.onChange}
									name="email"

								/>
							</div>
							<div>
								<label>Location</label>
								<input
									type="text"
									defaultValue={editObject.location}
									ref="location"
									onChange={this.onChange}
									name="location"

								/>
							</div>
							<div>
								<label>Homepage</label>
								<input
									type="text"
									defaultValue={editObject.home_page}
									ref="home_page"
									onChange={this.onChange}
									name="home_page"

								/>
							</div>
							<div>
								<label>Twitter</label>
								<input
									type="text"
									defaultValue={editObject.twitter}
									ref="twitter"
									onChange={this.onChange}
									name="twitter"

								/>
							</div>
							<div>
								<label>Facebook</label>
								<input
									type="text"
									defaultValue={editObject.facebook}
									ref="facebook"
									onChange={this.onChange}
									name="facebook"

								/>
							</div>
							<div>
								<label>Google Plus</label>
								<input
									type="text"
									defaultValue={editObject.googlePlus}
									ref="googlePlus"
									onChange={this.onChange}
									name="googlePlus"

								/>
							</div>
							<div>
								<label>LinkedIn</label>
								<input
									type="text"
									defaultValue={editObject.linkedIn}
									ref="linkedIn"
									onChange={this.onChange}
									name="linkedIn"

								/>
							</div>
						</Card>
						<Card className="education" title="Education">
							<Education items={editObject.education} onChange={this.valueChanged.bind(this, 'education')} />
						</Card>
						<Card className="positions" title="Positions">
							<Positions items={editObject.positions} onChange={this.valueChanged.bind(this, 'positions')} />
						</Card>
						<Card className="interests" title="Interests">
							<Interests items={editObject.interests} onChange={this.valueChanged.bind(this, 'interests')} />
						</Card>
					</ul>
					<div className="fixed-footer">
						<div className="the-fixed">
							<div className="controls buttons">
								<Link href="/" className="button tiny secondary">Cancel</Link>
								<button className="tiny primary">Save</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		);
	}
});
