
import NavigationBar from 'internal/navigation/components/Bar';

import Communities from './containers/Communities';
import Courses from './containers/Courses';
import Books from './containers/Books';
import Features from './containers/Features';
import Branding from './Branding';

export default function Root() {
	return (
		<div>
			<NavigationBar>
				<Branding position="left" />
			</NavigationBar>

			<Features />

			<Communities />

			<Courses />

			<Courses admin />

			<Books />
		</div>
	);
}
