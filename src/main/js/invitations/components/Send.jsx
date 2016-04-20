import React from 'react';
import {decodeFromURI} from 'nti-lib-ntiids';

import {load as getLibrary} from 'library/Actions';
import Banner from 'common/components/Banner';
import Loading from 'common/components/Loading';
import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';
import {scoped} from 'common/locale';

import SendForm from './SendForm';

const t = scoped('INVITATIONS');

export default React.createClass({
	displayName: 'Invitations:Send',

	mixins: [BasePathAware, ContextSender],

	propTypes: {
		courseId: React.PropTypes.string.isRequired
	},

	getInitialState () {
		return {
			loading: true
		};
	},

	componentWillMount () {
		this.setCourse();
	},

	setCourse ({courseId} = this.props) {
		getLibrary()
			.then(library => library.getCourse(decodeFromURI(courseId)))
			.then(course => this.setState({
				course: (course || {}).CourseInstance,
				loading: false
			}));
	},


	getContext () {
		const path = this.getBasePath();
		return Promise.resolve([
			{
				href: path, label: 'Home'
			}, {
				label: t('title')
			}
		]);
	},

	render () {

		const {loading, course} = this.state;

		if(loading) {
			return <Loading />;
		}

		return (
			<div className="invitation-send">
				<Banner item={course} />
				<SendForm course={course} />
			</div>
		);

	}
});
