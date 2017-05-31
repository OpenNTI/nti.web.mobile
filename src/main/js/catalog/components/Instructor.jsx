import PropTypes from 'prop-types';
import React from 'react';
import pad from 'zpad';
import {Constants} from 'nti-web-commons';
const {DataURIs: {BLANK_AVATAR, BLANK_IMAGE}} = Constants;


import {scoped} from 'nti-lib-locale';

const t = scoped('COURSE.INFO');

export default class extends React.Component {
    static displayName = 'Instructor';

    static propTypes = {
		instructor: PropTypes.object,
		assetRoot: PropTypes.string,
		index: PropTypes.number
	};

    state = {
        photo: BLANK_AVATAR
    };

    componentDidMount() {
		let {assetRoot, index} = this.props;
		let img = new Image();

		img.onload = () => this.setPhoto(img.src);

		img.src = assetRoot + 'instructor-photos/' + pad(index + 1) + '.png';
	}

    setPhoto = (photo) => {
		this.setState({photo});
	};

    render() {
		let {photo} = this.state;
		let {instructor} = this.props;
		let {Name, JobTitle} = instructor;
		let background = {backgroundImage: `url(${photo})`};

		return (
			<div className="course-instructor">
				<img style={background} src={BLANK_IMAGE} alt="Instructor Photo"/>
				<div className="meta">
					<div className="label">{t('Instructor')}</div>
					<div className="name">{Name}</div>
					<div className="job-title">{JobTitle}</div>
				</div>
			</div>
		);
	}
}
