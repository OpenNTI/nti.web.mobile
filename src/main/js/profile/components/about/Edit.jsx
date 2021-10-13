import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Link } from 'react-router-component';

import { scoped } from '@nti/lib-locale';
import { Loading } from '@nti/web-commons';
import NavigationGuard from 'internal/navigation/components/NavigationGuard';

import RedirectToProfile from '../../mixins/RedirectToProfile';
import Card from '../Card';

import BasicInfo from './edit/BasicInfo';
import Events from './edit/Events';
import Interests from './edit/Interests';

const t = scoped('common.errorMessages');

const EDUCATION = 'application/vnd.nextthought.profile.educationalexperience';
const PROFESSIONAL = 'application/vnd.nextthought.profile.professionalposition';

const ERROR_REQUIRED_MISSING = 'RequiredMissing';
const ERROR_VALIDATION = 'ValidationErrors';

export default createReactClass({
	displayName: 'Edit',

	mixins: [RedirectToProfile],

	propTypes: {
		entity: PropTypes.object.isRequired,
	},

	attachAboutRef(c) {
		this.about = c;
	},
	attachEducationRef(c) {
		this.education = c;
	},
	attachPositionsRef(c) {
		this.positions = c;
	},
	attachInterestsRef(c) {
		this.interests = c;
	},

	getInitialState() {
		return { loading: true };
	},

	componentDidMount() {
		this.setup();
	},

	componentDidUpdate(prevProps) {
		if (this.props.entity !== prevProps.entity) {
			this.setup();
		}
	},

	setup(props = this.props) {
		let { entity } = props;

		if (!entity) {
			return this.replaceState(this.getInitialState());
		}

		let editObject = entity.getData();
		for (let key of Object.keys(editObject)) {
			if (editObject[key] == null) {
				delete editObject[key];
			}
		}

		this.setState({ loading: true });

		entity
			.getProfileSchema()
			.then(schema => {
				let { education, positions } = schema;

				education.itemSchema = education.itemSchema || {
					school: { required: true },
					startYear: { required: true },
				};

				positions.itemSchema = positions.itemSchema || {
					companyName: { required: true },
					title: { required: true },
					startYear: { required: true },
				};

				return schema;
			})
			.then(schema =>
				this.setState({ editObject, loading: false, schema })
			);
	},

	validate() {
		let result = true;
		const parts = [
			this.about,
			this.education,
			this.positions,
			this.interests,
		].filter(x => x);
		for (let part of parts) {
			if (part.validate && !part.validate()) {
				result = false;
			}
		}
		return result;
	},

	save(e) {
		e.preventDefault();

		if (!this.validate()) {
			this.setState({
				error: {
					code: ERROR_VALIDATION,
					message: 'Please correct the errors above.',
				},
			});
			return;
		}

		const values = {};
		const parts = [
			this.about,
			this.education,
			this.positions,
			this.interests,
		].filter(x => x);
		for (let part of parts) {
			if (part.getValue) {
				Object.assign(values, part.getValue());
			}
		}

		this.setState({ busy: true }, () =>
			this.props.entity
				.save(values)
				.then(() =>
					this.setState({ loading: true }, () =>
						this.redirectToProfile()
					)
				)
				.catch(error => this.setState({ error, busy: false }))
		);
	},

	errorMessage(error) {
		if (error.code === ERROR_REQUIRED_MISSING) {
			let localizedFieldName = t(`fieldNames.${error.field}`, {
				fallback: error.field,
			});
			return t('requiredField', { field: localizedFieldName });
		}
		return (
			(error || {}).message ||
			`An unrecognized error occurred: ${error.code}.`
		);
	},

	dismissError(e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.setState({ error: void 0 });
	},

	render() {
		const { busy, editObject, error, schema, loading } = this.state;

		return (
			<div className="profile-edit">
				{loading ? (
					<Loading.Mask />
				) : (
					<div>
						<NavigationGuard message="You are currently editing your profile. Would you like to leave without saving?" />
						<form onSubmit={this.save}>
							<ul className="profile-cards">
								<Card className="about" title="About">
									<BasicInfo
										item={editObject}
										ref={this.attachAboutRef}
										schema={schema}
										error={error}
									/>
								</Card>

								<Card className="education" title="Education">
									<Events
										schema={schema}
										items={editObject.education}
										ref={this.attachEducationRef}
										field="education"
										fieldNames={['school', 'degree']}
										mimeType={EDUCATION}
									/>
								</Card>

								<Card
									className="positions"
									title="Professional"
								>
									<Events
										schema={schema}
										items={editObject.positions}
										ref={this.attachPositionsRef}
										field="positions"
										fieldNames={['companyName', 'title']}
										mimeType={PROFESSIONAL}
									/>
								</Card>

								<Card className="interests" title="Interests">
									<Interests
										schema={schema}
										items={editObject.interests}
										ref={this.attachInterestsRef}
										field="interests"
									/>
								</Card>
							</ul>

							<div className="fixed-footer">
								<div className="the-fixed">
									<div className="controls buttons">
										{error && (
											<div className="error">
												<a
													href="#"
													onClick={this.dismissError}
												>
													x
												</a>
												{this.errorMessage(error)}
											</div>
										)}

										<Link href="/" className="button link">
											Cancel
										</Link>
										<button className="primary">
											Save
										</button>
									</div>
								</div>
							</div>
						</form>

						{busy && (
							<div className="busy">
								<Loading.Mask />
							</div>
						)}
					</div>
				)}
			</div>
		);
	},
});
