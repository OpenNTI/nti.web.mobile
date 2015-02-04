import {Dispatcher} from 'flux';
import invariant from 'react/lib/invariant';

class AppDispatcher extends Dispatcher {

    constructor () {
        super();
    }


    /**
     * A bridge function between the views and the dispatcher, marking the action
     * as a view action.
     * @param  {object} action The data coming from the view.
     */
    handleViewAction (action) {
        // console.log('AppDispatcher::handleViewAction: %s', action.type);

        if ("production" !== process.env.NODE_ENV) {
            invariant(action.type, 'Expected there to be an action.type');
        }

        this.dispatch({
            source: 'VIEW_ACTION',
            action: action
        });
    }

    /**
     * A bridge function between the views and the dispatcher, marking the action
     * as a request action.
     * @param  {object} action The data coming from the request response.
     */
    handleRequestAction (action) {
        // console.log('AppDispatcher::handleRequestAction: %s', action.type);

        if ("production" !== process.env.NODE_ENV) {
            invariant(action.type, 'Expected there to be an action.type');
        }

        this.dispatch({
            source: 'REQUEST_ACTION',
            action: action
        });
    }

}

export default new AppDispatcher();
