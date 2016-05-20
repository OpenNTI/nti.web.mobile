import React from 'react';
import {encodeForURI} from 'nti-lib-ntiids';

import {scoped} from 'nti-lib-locale';
import {Loading} from 'nti-web-commons';

import BasePath from 'common/mixins/BasePath';

import {enrollOpen} from '../../Api';

const t = scoped('ENROLLMENT.BUTTONS');

export default React.createClass({
	displayName: 'OpenEnrollmentWidget',

	mixins: [BasePath],

	propTypes: {
		catalogEntry: React.PropTypes.object.isRequired,
		enrollmentOption: React.PropTypes.object
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
		this.setUp(nextProps);
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
			}));
		});

	},

	dropButton () {
		const {catalogEntry} = this.props;
		const base = this.getBasePath();
		const entry = encodeForURI(catalogEntry.getID());
		return (<a className="button" href={`${base}catalog/enroll/drop/${entry}/`}>Drop This Course</a>);
	},

	render () {

		if (this.state.busy) {
			return <div><Loading /></div>;
		}

		const {enrolled} = this.state;

		return (
			<div>
				<div className="enrollment open-enrollment">
					<h2 className="title">Enroll for Free</h2>
					<p className="description">Get complete access to interact with all course content, including lectures, course materials, quizzes, and discussions once class is in session.</p>
					
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
