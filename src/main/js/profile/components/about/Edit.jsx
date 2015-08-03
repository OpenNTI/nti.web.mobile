import React from 'react';

import {Link} from 'react-router-component';

import Conditional from 'common/components/Conditional';
import Loading from 'common/components/Loading';

import NavigationGuard from 'navigation/components/NavigationGuard';

import BasicInfo from './edit/BasicInfo';
import Events from './edit/Events';
import Interests from './edit/Interests';

import Card from '../Card';
import RedirectToProfile from '../../mixins/RedirectToProfile';

import {scoped} from 'common/locale';

let t = scoped('ERROR_MESSAGES');

const EDUCATION = 'application/vnd.nextthought.profile.educationalexperience';
const PROFESSIONAL = 'application/vnd.nextthought.profile.professionalposition';

const ERROR_REQUIRED_MISSING = 'RequiredMissing';

export default React.createClass({
	displayName: 'Edit',

	mixins: [RedirectToProfile],

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},


	getInitialState () {
		return {loading: true};
	},


	componentWillMount () { this.setup(); },

	componentWillReceiveProps (nextProps) {
		if (this.props.entity !== nextProps.entity) {
			this.setup(nextProps);
		}
	},

	setup (props = this.props) {
		let {entity} = props;

		if (!entity) {
			return this.replaceState(this.getInitialState());
		}

		let editObject = entity.getData();
		for (let key of Object.keys(editObject)) {
			if (editObject[key] == null) {
				delete editObject[key];
			}
		}

		this.setState({loading: true});

		entity.getProfileSchema()
			.then(schema => {
				let {education, positions} = schema;

				education.itemSchema = education.itemSchema || {
					school: {required: true},
					startYear: {required: true}
				};

				positions.itemSchema = positions.itemSchema || {
					companyName: {required: true},
					title: {required: true},
					startYear: {required: true}
				};

				return schema;
			})
			.then(schema => this.setState({editObject, loading: false, schema}));
	},


	save (e) {
		e.preventDefault();

		let values = {};
		let parts = Object.values(this.refs);
		for (let part of parts) {
			if (part.getValue) {
				Object.assign(values, part.getValue());
			}
		}

		this.setState({ busy: true }, () =>
			this.props.entity.save(values)
				.then(() =>
					this.setState({loading: true}, () => this.redirectToProfile()))
				.catch(error => this.setState({ error, busy: false })
			));
	},

	errorMessage (error) {
		if (error.code === ERROR_REQUIRED_MISSING) {
			let localizedFieldName = t(`FIELDNAMES.${error.field}`, {fallback: error.field});
			return t('requiredField', {field: localizedFieldName});
		}
		return (error || {}).message || `An unrecognized error occurred: ${error.code}.`;
	},


	dismissError () {
		this.setState({error: void 0});
	},


	render () {
		let {busy, editObject, error, schema, loading} = this.state;

		return (
			<div className="profile-edit">
				{loading ? (
					<Loading/>
				) : (
					<div>
						<NavigationGuard message="You are currently editing your profile. Would you like to leave without saving?"/>
						<form onSubmit={this.save}>
							<ul className="profile-cards">

								<Card className="about" title="About">
									<BasicInfo item={editObject} ref="about" schema={schema}/>
								</Card>

								<Card className="education" title="Education">
									<Events schema={schema} items={editObject.education} ref="education" field="education" fieldNames={['school', 'degree']} mimeType={EDUCATION}/>
								</Card>

								<Card className="positions" title="Professional">
									<Events schema={schema} items={editObject.positions} ref="positions" field="positions" fieldNames={['companyName', 'title']} mimeType={PROFESSIONAL}/>
								</Card>

								<Card className="interests" title="Interests">
									<Interests schema={schema} items={editObject.interests} ref="interests" field="interests"/>
								</Card>

							</ul>

							<div className="fixed-footer">
								<div className="the-fixed">
									<div className="controls buttons">
										{error && (
											<div className="error">
												<a href="#" onClick={this.dismissError}>x</a>
												{this.errorMessage(error)}
											</div>
										)}

										<Link href="/" className="button tiny link">Cancel</Link>
										<button className="tiny primary">Save</button>
									</div>
								</div>
							</div>
						</form>
						<Conditional condition={busy} className="busy">
							<Loading />
						</Conditional>
					</div>
				)}
			</div>
		);
	}
});
