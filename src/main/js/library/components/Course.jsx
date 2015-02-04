import React from 'react/addons';
import CourseContentLink from './CourseContentLink';
import {BLANK_IMAGE} from 'common/constants/DataURIs';

export default React.createClass({
	displayName: 'Course',

	propTypes: {
		item: React.PropTypes.object.isRequired
	},


	getItem() {return this.props.item;},

	itemChanged () { this.forceUpdate(); },

	componentWillMount () {
		this.getItem().addListener('changed', this.itemChanged); },

	componentWillUnmount () {
		this.getItem().removeListener('changed', this.itemChanged); },


	render () {
		var item = this.getItem();
		var p = item.getPresentationProperties();
		var courseId = item.getCourseID();
		var style = {
			backgroundImage: p && p.icon && 'url(' + p.icon + ')'
		};
		return (
			<li className="grid-item">
				<CourseContentLink courseId={courseId}>
					<img style={style} src={BLANK_IMAGE}/>
					<div className="metadata">
						<h3>{p.title}</h3>
						<h5>{p.label}</h5>
					</div>
				</CourseContentLink>
			</li>
		);
	}
});
