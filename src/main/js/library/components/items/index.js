import Bundle from './Bundle';
import Community from './Community';
import Course from './Course';
import Package from './Package';


const WIDGETS = [
	Bundle,
	Community,
	Course,
	Package,
];

export default function getItem (item) {

	for (let widget of WIDGETS) {
		if (widget.handles(item)) {
			return widget;
		}
	}

}
