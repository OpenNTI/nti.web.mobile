import Group from './Group';
import Markup from './Markup';
import Matrix from './Matrix';
import MultiInput from './MultiInput';
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
	'markup': Markup,
	'matrix': Matrix,
	'multiinput': MultiInput,
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
