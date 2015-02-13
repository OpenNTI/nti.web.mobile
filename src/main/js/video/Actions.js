import AppDispatcher from 'dispatcher/AppDispatcher';
import {VIDEO_PLAYER_EVENT} from 'analytics/Constants';

export function emitVideoEvent(event) {
	AppDispatcher.handleViewAction({type: VIDEO_PLAYER_EVENT, event});
}
