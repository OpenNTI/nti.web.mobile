import React from 'react';
import pad from 'zpad';

import {BLANK_AVATAR, BLANK_IMAGE} from 'common/constants/DataURIs';

import {scoped} from 'common/locale';

const t = scoped('COURSE.INFO');

const Instructor = React.createClass({
	displayName: 'Instructor',


	getInitialState () {
		return {
			photo: BLANK_AVATAR
		};
	},


	componentDidMount () {
		let {assetRoot, index} = this.props;
		let img = new Image();

		img.onload = () => {
			if (!this.isMounted()) {
				return;
			}

			this.setState({photo: img.src});
		};

		img.src = assetRoot + 'instructor-photos/' + pad(index + 1) + '.png';
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
					<div className='meta'>
						<div className="label">{t('Instructor')}</div>
						<div className="name">{Name}</div>
						<div className="job-title">{JobTitle}</div>
					</div>
				</div>
			</div>
		);
	}
});


export default React.createClass({
	displayName: 'Instructors',
	render () {
		let {entry} = this.props;
		let instructors = ((entry || {}).Instructors) || [];
		let root = '/no-root/';

		if (entry) {
			root = entry.getAssetRoot() || root;
		}

		return (
			<div className="instructors">
			{instructors.map((i, index) =>
				<Instructor key={i.Name} index={index} assetRoot={root} instructor={i}/>
			)}
			</div>
		);
	}
});
