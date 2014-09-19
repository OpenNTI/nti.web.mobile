/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var pad = require('zpad');

var BLANK_IMAGE = require('common/constants/DataURIs').BLANK_IMAGE;

var locale = require('common/locale');
function _t(key, options) { return locale('COURSE_INFO.' + key, options); }

var Instructor = React.createClass({
	displayName: 'Instructor',

	render: function() {
		var props = this.props;
		var i = props.instructor || {};
		var index = pad(props.index + 1);
		var photo = props.assetRoot + 'instructor-photos/' + index + '.png';
		var background = {
			backgroundImage: 'url(' + photo + ')'
		};

		return (
			<div className="row instructor">
				<img style={background} src={BLANK_IMAGE} alt="Instructor Photo"/>
				<div className='meta'>
					<div className="label">{_t('Instructor')}</div>
					<div className="name">{i.Name}</div>
					<div className="job-title">{i.JobTitle}</div>
				</div>
			</div>
		);
	}
});


module.exports = React.createClass({
	displayName: 'Instructors',
	render: function() {
		var e = this.props.entry;
		var instructors = (e || {}).Instructors || [];
		var root = '/no-root/';

		if (e) {
			root = e.getAssetRoot() || e;
		}

		return (
			<div className="instructors">
			{instructors.map(function(i, index) {
				return <Instructor key={i.Name} index={index} assetRoot={root} instructor={i}/>
			})}
			</div>
		);
	}
});
