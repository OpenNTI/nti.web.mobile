import Group from './Group';
import Radio from './Radio';
import Select from './Select';
import Text from './Text';
import Unknown from './Unknown';

const WIDGETS = {
	'group': Group,
	'radio': Radio,
	'select': Select,
	'text': Text
};

export default function widget (type) {
	return WIDGETS[type] || Unknown;
}
