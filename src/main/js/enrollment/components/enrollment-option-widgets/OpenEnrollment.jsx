import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {encodeForURI} from 'nti-lib-ntiids';
import {scoped} from 'nti-lib-locale';
import {Loading, Mixins} from 'nti-web-commons';

import {enrollOpen} from '../../Api';

const t = scoped('enrollment.buttons', {
	OpenEnrollment: 'Enroll in the open course',
});

export default createReactClass({
	displayName: 'OpenEnrollmentWidget',

	mixins: [Mixins.BasePath],

	propTypes: {
		catalogEntry: PropTypes.object.isRequired,
		enrollmentOption: PropTypes.object
	},

	getInitialState () {
		return {
			busy: false
		};
	},

	statics: {
		re: /openenrollmentoption/i,
		handles (option) {
			return this.re.test(option && option.MimeType);
		}
	},

	componentWillMount () {
		this.setUp();
	},

	componentWillReceiveProps (nextProps) {
		if (this.props.catalogEntry !== nextProps.catalogEntry) {
			this.setUp(nextProps);
		}
	},

	setUp (props = this.props) {
		const {enrollmentOption: {enrolled}} = props;
		this.setState({
			enrolled
		});
	},

	enroll (event) {
		event.preventDefault();
		event.stopPropagation();

		this.setState({ busy: true }, () => {
			enrollOpen(this.props.catalogEntry.getID())
				.then((result) => this.setState({
					busy: false,
					enrolled: result.success
				}))
				.catch(reason => {
					this.setState({
						error: reason,
						busy: false
					});
				});
		});

	},

	dropButton () {
		const {catalogEntry} = this.props;
		const base = this.getBasePath();
		const entry = encodeForURI(catalogEntry.getID());
		return (<a className="button drop-course" href={`${base}catalog/enroll/drop/${entry}/`}>Drop This Course</a>);
	},

	render () {

		if (this.state.busy) {
			return <div><Loading.Mask /></div>;
		}

		const {enrolled, error} = this.state;

		return (
			<div>
				<div className="enrollment open-enrollment">
					<h2 className="title">Enroll for Free</h2>
					<p className="description">Get complete access to interact with all course content, including lectures, course materials, quizzes, and discussions once class is in session.</p>
					{error && <p className="error">{error.message}</p>}
					{enrolled
						?
						(
							<div>
								<div className="enrollment-status">
									<div className="status">
										<span className="registered">You are registered</span>
									</div>
								</div>
								<div className="actions">{this.dropButton()}</div>
							</div>
						)
						:
						(<div className="actions"><a onClick={this.enroll}>{t('OpenEnrollment')}</a></div>)
					}

				</div>
			</div>
		);
	}

});
