import React from 'react';
import pad from 'zpad';

import {BLANK_AVATAR, BLANK_IMAGE} from 'common/constants/DataURIs';

import {scoped} from 'common/locale';

const t = scoped('COURSE.INFO');

export default React.createClass({
	displayName: 'Instructor',

	propTypes: {
		instructor: React.PropTypes.object,
		assetRoot: React.PropTypes.string,
		index: React.PropTypes.number
	},


	getInitialState () {
		return {
			photo: BLANK_AVATAR
		};
	},


	componentDidMount () {
		let {assetRoot, index} = this.props;
		let img = new Image();

		img.onload = () => this.setPhoto(img.src);

		img.src = assetRoot + 'instructor-photos/' + pad(index + 1) + '.png';
	},


	setPhoto (photo) {
		this.setState({photo});
	},


	render () {
		let {photo} = this.state;
		let {instructor} = this.props;
		let {Name, JobTitle} = instructor;
		let background = {backgroundImage: `url(${photo})`};

		return (
			<div className="row instructor">
				<div className="small-12 columns">
					<img style={background} src={BLANK_IMAGE} alt="Instructor Photo"/>
					<div className="meta">
						<div className="label">{t('Instructor')}</div>
						<div className="name">{Name}</div>
						<div className="job-title">{JobTitle}</div>
					</div>
				</div>
			</div>
		);
	}
});
