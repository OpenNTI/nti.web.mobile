
import {getAppUserCommunities} from '../utils';

export default {

	componentDidMount () {
		this.loadCommunities();
	},


	componentWillReceiveProps () {
		this.loadCommunities();
	},

	loadCommunities () {
		this.setState({loading: true});
		getAppUserCommunities(true).then(x => this.setState({communities: x, loading: false}));
	}
};
