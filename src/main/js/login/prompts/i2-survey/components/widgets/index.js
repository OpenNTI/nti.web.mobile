import Group from './Group';
import Matrix from './Matrix';
import MultipleChoice from './MultipleChoice';
import Number from './Number';
import Ordering from './Ordering';
import Radio from './Radio';
import Select from './Select';
import Text from './Text';
import Textarea from './Textarea';
import Unknown from './Unknown';

const WIDGETS = {
	'group': Group,
	'matrix': Matrix,
	'multiple': MultipleChoice,
	'number': Number,
	'ordering': Ordering,
	'radio': Radio,
	'select': Select,
	'text': Text,
	'textarea': Textarea
};

export default function widget (type) {
	return WIDGETS[type] || Unknown;
}
