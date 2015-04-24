import * as Constants from './Constants';
import AppDispatcher from 'dispatcher/AppDispatcher';

export default {

	sendMessage (fieldValues) {
		dispatch(Constants.SEND_MESSAGE, fieldValues);
	}

};


function dispatch(type, data) {
	AppDispatcher.handleRequestAction({type, data});
}
