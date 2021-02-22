import { default as isTouch, PointerEvents } from '@nti/util-detection-touch';
import iOSVersion from '@nti/util-ios-version';

const [major, minor] = iOSVersion() || [];
const isBroken = (isTouch && major > 11) || (major === 11 && minor >= 3);

// iOS 11.3+ doesn't allow non-passive dynamically added touchmove events,
// meaning that event listeners added when a drag starts are unable to preventDefault
// on the event, which we need to prevent document scrolling.
// see: https://bugs.webkit.org/show_bug.cgi?id=184250
//
// This solution is based on the react-beautiful-dnd workaround
// https://github.com/atlassian/react-beautiful-dnd/blob/74562f733fbd8795c4f41b8f222ce8eb9dc19150/src/view/drag-handle/sensor/create-touch-sensor.js#L138

export default !isBroken
	? {}
	: {
			componentDidMount() {
				const options = {
					passive: false,
					capture: false,
				};

				const handler = safariTouchMoveHandler.bind(this);

				global.addEventListener(
					PointerEvents.pointerMove,
					handler,
					options
				);

				this.removeSafariHack = () =>
					global.removeEventListener(
						PointerEvents.pointerMove,
						handler,
						options
					);
			},

			componentWillUnmount() {
				if (this.removeSafariHack) {
					this.removeSafariHack();
				}
			},
	  };

function safariTouchMoveHandler(e) {
	const { dragging } = this.state;

	if (!dragging || e.defaultPrevented) {
		return;
	}

	e.preventDefault();
}
