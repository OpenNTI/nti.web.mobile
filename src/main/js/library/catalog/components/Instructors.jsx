/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var pad = require('zpad');

var BLANK_AVATAR = require('common/constants/DataURIs').BLANK_AVATAR;
var BLANK_IMAGE = require('common/constants/DataURIs').BLANK_IMAGE;

var locale = require('common/locale').translate;
function _t(key, options) { return locale('COURSE_INFO.' + key, options); }

var Instructor = React.createClass({
	displayName: 'Instructor',


	getInitialState: function() {
		return {
			photo: BLANK_AVATAR
		};
	},



	componentDidMount: function() {
		var me = this;
		var props = me.props;
		var img = new Image();

		img.onload = function () {
			if (!me.isMounted()) {
				return;
			}

			me.setState({photo: img.src});
		};

		img.src = props.assetRoot + 'instructor-photos/' + pad(props.index + 1) + '.png';
	},


	render: function() {
		var props = this.props;
		var i = props.instructor || {};

		var background = {
			backgroundImage: 'url(' + this.state.photo + ')'
		};

		return (
			<div className="row instructor">
				<div className="small-12 columns">
					<img style={background} src={BLANK_IMAGE} alt="Instructor Photo"/>
					<div className='meta'>
						<div className="label">{_t('Instructor')}</div>
						<div className="name">{i.Name}</div>
						<div className="job-title">{i.JobTitle}</div>
					</div>
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
				return (<Instructor key={i.Name} index={index} assetRoot={root} instructor={i}/>);
			})}
			</div>
		);
	}
});
