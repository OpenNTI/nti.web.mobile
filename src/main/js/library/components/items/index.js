import Bundle from './Bundle';
import CommunityItem from './CommunityItem';
import Course from './Course';
import Package from './Package';

const WIDGETS = [
	CommunityItem,
	Course,
	Bundle,
	Package
];


export default function getItem (item) {

	for (let widget of WIDGETS) {
		if (widget.handles(item)) {
			return widget;
		}
	}

}
