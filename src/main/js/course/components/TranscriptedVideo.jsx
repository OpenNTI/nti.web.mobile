import './TranscriptedVideo.scss';
import PropTypes from 'prop-types';
import cx from 'classnames';
import createReactClass from 'create-react-class';
/* See: https://github.com/mozilla/vtt.js#usage */
import { WebVTT, VTTCue /*, VTTRegion*/ } from 'vtt.js';

import { decodeFromURI } from '@nti/lib-ntiids';
import Logger from '@nti/util-logger';
import { DarkMode, Error, Loading, Mixins } from '@nti/web-commons';
import { Component as Video, VideoContext } from '@nti/web-video';
import { ControlBar, Resume, WatchedSegments } from '@nti/web-video/controls';
import Discussions from 'internal/content/components/discussions';
import Gutter from 'internal/content/components/Gutter';
import ContextSender from 'internal/common/mixins/ContextSender';
import {
	NOT_FOUND,
	RETRY_AFTER_DOM_SETTLES,
} from 'internal/content/components/annotations/Annotation';

import Transcript from './Transcript';

const logger = Logger.get('course:transcripted-video');

const None = void 0;

const Controls = styled(ControlBar)`
	padding: 0.5rem 0.25rem;
`;

class Annotation {
	constructor(item, ownerCmp) {
		Object.assign(this, { item, ownerCmp });
	}

	get id() {
		return this.item.getID();
	}

	resolveVerticalLocation() {
		const getStart = x =>
			x && x.getStart && x.getStart().getSeconds().toFixed(3);

		const { ownerCmp, item } = this;
		const { applicableRange } = item;
		const start = getStart(applicableRange);

		const { transcript } = ownerCmp;

		if (!transcript || !transcript.node) {
			return RETRY_AFTER_DOM_SETTLES;
		} else if (transcript.unmounted) {
			return NOT_FOUND;
		}

		const { scrollTop } = document.body;

		const cue =
			start &&
			transcript.node.querySelector(`[data-start-time="${start}"]`);

		//getBoundingClientRect is effected by scroll position... so add it back in.
		return (
			(cue ? cue : transcript.node).getBoundingClientRect().top +
			scrollTop
		);
	}
}

export default createReactClass({
	displayName: 'TranscriptedVideo',
	mixins: [ContextSender, Mixins.NavigatableMixin],

	propTypes: {
		MediaIndex: PropTypes.object.isRequired,
		outlineId: PropTypes.string,
		videoId: PropTypes.string,
		course: PropTypes.object,

		showDiscussions: PropTypes.bool,
		lightMode: PropTypes.bool,
		gutterPrefix: PropTypes.string,
		noNavigation: PropTypes.bool,
		noPager: PropTypes.bool,
	},

	attachVideoRef(x) {
		this.video = x;
	},
	attachTranscriptRef(x) {
		this.transcript = x;
	},
	attachGutterRef(x) {
		this.gutter = x;
	},

	getInitialState() {
		return {
			loading: true,
			error: false,
			cues: None,
			regions: None,
			currentTime: 0,
		};
	},

	componentDidMount() {
		this.getDataIfNeeded(this.props);
	},

	componentWillUnmount() {
		this.loadDiscussions(None);
	},

	componentDidUpdate(prevProps, prevState) {
		let { outlineId, MediaIndex, videoId, showDiscussions, noPager } =
			this.props;
		let { currentTime, video } = this.state;

		if (prevProps.videoId !== videoId) {
			return this.getDataIfNeeded(this.props);
		}

		if (!prevProps.showDiscussions && showDiscussions && currentTime) {
			this.setState({ returnTime: currentTime });
		}

		if (video !== prevState.video && !noPager) {
			logger.debug('Updating Pager...');
			let pageSource =
				video && MediaIndex.filter(x => x.isVideo).getPageSource(video);

			if (outlineId && pageSource) {
				pageSource = pageSource.scoped(decodeFromURI(outlineId));
			}

			if (video) {
				this.setPageSource(pageSource, video.getID());
			}
		}
	},

	onError(error) {
		this.setState({
			loading: false,
			error: error,
			data: None,
		});
	},

	getContext() {
		let { videoId, gutterPrefix } = this.props;
		const id = gutterPrefix != null ? gutterPrefix : videoId;

		return Promise.resolve({
			label: 'Video',
			href: this.makeHref(id + '/'),
		});
	},

	getDataIfNeeded(props) {
		this.replaceState(this.getInitialState());

		try {
			const { MediaIndex, videoId } = props;
			const decodedId = decodeFromURI(videoId);
			let video = MediaIndex.get(decodedId);

			this.resolveContext().then(context => this.setState({ context }));

			if (!video) {
				logger.error(
					'How do we get a video id ("%s") and not find it in the index?: ',
					decodedId,
					MediaIndex
				);
				return this.setState({ error: 'No Video' });
			}

			let transcript = this.loadTranscript(video);
			let notes = this.loadDiscussions(video);
			let slides = this.loadSlides(video, props);

			Promise.all([notes, transcript, slides])
				.then(() => this.setState({ loading: false }))
				.catch(this.onError);
		} catch (e) {
			this.onError(e);
		}
	},

	loadDiscussions(video) {
		let { store } = this.state;

		if (store) {
			store.removeListener('change', this.onStoreChanged);
		}

		return (
			video &&
			video
				.getUserData()
				.then(x => x.waitForPending().then(() => x))
				.then(x => {
					x.addListener('change', this.onStoreChanged);
					this.setState(
						{
							store: x,
							storeProvider: { getUserDataStore: () => x },
						},
						() => this.onStoreChanged(x)
					);
				})
		);
	},

	loadTranscript(video) {
		return video
			.getTranscript('en', 'normal')
			.then(vtt => {
				const parser = new WebVTT.Parser(
					global,
					WebVTT.StringDecoder()
				);
				const cues = [];
				const regions = [];

				parser.oncue = cue => cues.push(cue);
				parser.onregion = region => regions.push(region);
				parser.onparsingerror = e => {
					throw e;
				};

				//Safari has a native VTTCue but it doesn't honor auto (which is in the spec)
				//so for now just force it to use the poly-fill
				const oldVTTCue = global.VTTCue;

				try {
					global.VTTCue = VTTCue;

					parser.parse(vtt);
					parser.flush();
				} finally {
					global.VTTCue = oldVTTCue;
				}

				this.setState({ cues, regions, video });
			})
			.catch(reason => {
				if (
					reason === video.NO_TRANSCRIPT ||
					reason === video.NO_TRANSCRIPT_LANG ||
					reason.statusCode === 404
				) {
					this.setState({ cues: None, regions: None, video });
					return;
				}
				return Promise.reject(reason);
			});
	},

	loadSlides(video, props) {
		const { outlineId: encodedId, MediaIndex } = props;
		const { slidedecks } = video;
		const outlineId = encodedId && decodeFromURI(encodedId);

		if (!slidedecks || !slidedecks.length) {
			return;
		}

		let index = MediaIndex;
		if (outlineId) {
			index = index.scoped(outlineId);
		}

		const decks = slidedecks.filter(x => index.get(x));
		if (!decks.length) {
			logger.warn(
				'Referenced slidedecks do not exist in scope. %o %o',
				video,
				index
			);
			return;
		}
		if (decks.length > 1) {
			logger.warn(
				'Multiple slidedecks for video: %o %o',
				video.getID(),
				decks.join(', ')
			);
		}

		//The webapp is currently letting the "last" slidedeck win... so lets pick from the end of the list.
		const deck = index.get(decks.pop());

		this.setState({ slides: deck.Slides });
	},

	getAnalyticsData() {
		let { context, cues, regions, video } = this.state;
		let { course } = this.props;

		let courseId = course.getID();

		return {
			resourceId: video.ntiid,
			rootContextId: courseId,
			context: context || [],
			withTranscript: Boolean(cues || regions),
		};
	},

	onStoreChanged(store) {
		if (this.state.store !== store) {
			return;
		}

		let annotations = {};

		for (let item of store) {
			annotations[item.getID()] = new Annotation(item, this);
		}

		this.setState({ annotations });
	},

	onVideoTimeTick(event) {
		let time = (event.target || {}).currentTime;
		let { returnTime } = this.state;

		if (returnTime != null) {
			this.onJumpTo(returnTime);
			returnTime = null;
		}
		if (!this.bookkeeping || this.bookkeeping.time < time) {
			this.setState({ currentTime: time, returnTime });
		}
		if (this.bookkeeping && this.bookkeeping.expires < Date.now()) {
			delete this.bookkeeping;
		}
	},

	onJumpTo(time) {
		const { video } = this;
		if (video) {
			video.setCurrentTime(parseFloat(time));
			// the video may not jump to exactly the time we specify.
			// do a bit of bookkeeping to prevent the transcript highlight
			// from jumping around.
			this.bookkeeping = {
				time,
				expires: Date.now() + 5000,
			};
		}
	},

	setDiscussionFilter(selectedDiscussions) {
		this.setState({ selectedDiscussions });
	},

	redrawGutter() {
		const { gutter } = this;
		if (gutter) {
			gutter.handleContentUpdate?.();
		}
	},

	render() {
		let { showDiscussions, videoId, lightMode, gutterPrefix } = this.props;
		let {
			annotations,
			storeProvider,
			selectedDiscussions,
			error,
			video,
			cues,
			regions,
			slides,
			currentTime,
			loading,
		} = this.state;

		loading = loading || !video;

		if (error && !video) {
			return <Error error={error} />;
		}

		if (loading) {
			return <Loading.Mask />;
		}

		if (showDiscussions) {
			return (
				<Discussions
					UserDataStoreProvider={storeProvider}
					filter={selectedDiscussions}
				/>
			);
		}

		return (
			<div
				className={cx('transcripted-video', {
					'light-mode': lightMode,
				})}
			>
				{!lightMode && <DarkMode />}
				<VideoContext>
					{!video ? (
						None
					) : (
						<>
							<Video
								ref={this.attachVideoRef}
								src={video}
								onTimeUpdate={this.onVideoTimeTick}
								analyticsData={this.getAnalyticsData()}
							/>
							<Controls dark={!lightMode}>
								<Resume />
								<WatchedSegments.Trigger />
							</Controls>
						</>
					)}
				</VideoContext>
				<div className="transcript">
					{error ? (
						<div>Transcript not available</div>
					) : (
						<Transcript
							ref={this.attachTranscriptRef}
							onSlideLoaded={this.redrawGutter}
							onJumpTo={this.onJumpTo}
							currentTime={currentTime}
							regions={regions}
							cues={cues}
							slides={slides}
						/>
					)}
					<Gutter
						ref={this.attachGutterRef}
						items={annotations}
						selectFilter={this.setDiscussionFilter}
						prefix={gutterPrefix != null ? gutterPrefix : videoId}
					/>
				</div>
			</div>
		);
	},
});
