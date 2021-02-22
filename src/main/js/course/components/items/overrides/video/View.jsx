import React from 'react';
import PropTypes from 'prop-types';
import Router from 'react-router-component';
import { Error, Loading } from '@nti/web-commons';

import Page from '../Page';
import Registry from '../Registry';
import TranscriptedVideo from '../../../TranscriptedVideo';

const MIME_TYPES = {
	'application/vnd.nextthought.ntivideo': true,
};

const handles = obj => {
	const { location } = obj || {};
	const { item } = location || {};

	return item && MIME_TYPES[item.MimeType];
};

export default class CourseItemAssignment extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		location: PropTypes.object,
		outlineId: PropTypes.string,
	};

	state = {};

	componentDidMount() {
		this.setup();
	}

	componentDidUpdate(prevProps) {
		const { location } = this.props;
		const { location: prevLocation } = prevProps;

		if (location !== prevLocation) {
			this.setup();
		}
	}

	async setup(props = this.props) {
		const { course } = this.props;

		try {
			const mediaIndex = await course.getMediaIndex();

			this.setState({
				mediaIndex,
			});
		} catch (e) {
			this.setState({
				mediaIndex: null,
				error: e,
			});
		}
	}

	render() {
		const { location, course, outlineId } = this.props;
		const { item: video } = location || {};
		const { mediaIndex, error } = this.state;

		const transcriptProps = {
			MediaIndex: mediaIndex,
			videoId: video.getID(),
			course,
			outlineId,
			lightMode: true,
			gutterPrefix: '',
		};

		return (
			<Page {...this.props}>
				{!mediaIndex && !error && <Loading.Spinner.Large />}
				{error && <Error error={error} />}
				{mediaIndex && !error && (
					<Router.Locations className="course-item-video" contextual>
						<Router.Location
							path="/discussions(/*)"
							handler={TranscriptedVideo}
							{...transcriptProps}
							showDiscussions
						/>
						<Router.NotFound
							handler={TranscriptedVideo}
							{...transcriptProps}
						/>
					</Router.Locations>
				)}
			</Page>
		);
	}
}

Registry.register(handles)(CourseItemAssignment);
