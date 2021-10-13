import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import cx from 'classnames';

import { encodeForURI } from '@nti/lib-ntiids';
import { EmptyList, Mixins } from '@nti/web-commons';
import ContextSender from 'internal/common/mixins/ContextSender';

//some notes: http://stackoverflow.com/questions/20870448/reactjs-modeling-bi-directional-infinite-scrolling
//I want to turn this into a buffered list.

const VideoCell = createReactClass({
	displayName: 'VideoCell',
	mixins: [Mixins.NavigatableMixin],

	propTypes: {
		item: PropTypes.object,
	},

	getInitialState() {
		return {};
	},

	componentDidMount() {
		this.fillIn();
	},

	componentDidUpdate(prevProps) {
		if (this.props.item !== prevProps.item) {
			this.fillIn();
		}
	},

	async fillIn(props = this.props) {
		const { item } = props || {};

		function fallback(x) {
			let s = x && ((x.sources || [])[0] || {});
			return s.thumbnail || s.poster;
		}

		try {
			const thumbnail = await item.getThumbnail();

			if (!thumbnail) {
				const poster = await item.getPoster();
				this.setState({ poster });
			} else {
				this.setState({ poster: thumbnail });
			}
		} catch (error) {
			fallback(item);
		}
	},

	render() {
		const {
			state: { poster },
			props: { item },
		} = this;
		const style = poster && { backgroundImage: `url(${poster})` };
		const thumbnail = cx('thumbnail', { resolving: !poster });
		const link = this.makeHref(encodeForURI(item.ntiid)) + '/';

		return (
			<li className="thumbnail-grid-item">
				<a title="Play" href={link}>
					<div className={thumbnail} style={style} />
					<h3>{item.title}</h3>
				</a>
			</li>
		);
	},
});

export default createReactClass({
	displayName: 'VideoGrid',
	mixins: [ContextSender],

	propTypes: {
		MediaIndex: PropTypes.object,
	},

	getContext() {
		return Promise.resolve([]);
	},

	render() {
		const { MediaIndex } = this.props;

		if (!MediaIndex || MediaIndex.length === 0) {
			return <EmptyList type="videos" />;
		}

		return (
			<ul className="small-block-grid-1 medium-block-grid-2">
				{MediaIndex.filter(x => x.isVideo).map(v => (
					<VideoCell index={MediaIndex} item={v} key={v.ntiid} />
				))}
			</ul>
		);
	},
});
