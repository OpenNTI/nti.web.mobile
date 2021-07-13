import { Registry } from '@nti/lib-commons';

import Page from './Page';

const wrap = X =>
	X &&
	(props => (
		<Page {...props}>
			<X {...props} />
		</Page>
	));

class CourseItemsOverrides extends Registry.Handler {
	static register(matcher, item) {
		// If the parent class returns truthy, it has not registered anything and is depending on
		// the decorator returned function do perform the registration. (If it gets more than 1
		// arg it will register whatever value is in argument position 1, using arg 0 as the key.)
		if (super.register.apply(this, [matcher, wrap(item)].filter(Boolean))) {
			// Return a "decorator" function to perform the registering.
			return Component => {
				this.registerItem(matcher, wrap(Component));
			};
		}
	}
}

export default CourseItemsOverrides;
