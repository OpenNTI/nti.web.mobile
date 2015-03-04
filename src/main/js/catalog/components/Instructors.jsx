import React from 'react';
import pad from 'zpad';

import {BLANK_AVATAR, BLANK_IMAGE} from 'common/constants/DataURIs';

import {scoped} from 'common/locale';

const _t = scoped('COURSE.INFO');

var Instructor = React.createClass({
	displayName: 'Instructor',


	getInitialState () {
		return {
			photo: BLANK_AVATAR
		};
	},


	componentDidMount () {
		var {assetRoot, index} = this.props;
		var img = new Image();

		img.onload = () => {
			if (!this.isMounted()) {
				return;
			}

			this.setState({photo: img.src});
		};

		img.src = assetRoot + 'instructor-photos/' + pad(index + 1) + '.png';
	},


	render () {
		var {photo} = this.state;
		var {instructor} = this.props;
		var {Name, JobTitle} = instructor;
		var background = {backgroundImage: `url(${photo})`};

		return (
			<div className="row instructor">
				<div className="small-12 columns">
					<img style={background} src={BLANK_IMAGE} alt="Instructor Photo"/>
					<div className='meta'>
						<div className="label">{_t('Instructor')}</div>
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
		var {entry} = this.props;
		var instructors = ((entry || {}).Instructors) || [];
		var root = '/no-root/';

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
