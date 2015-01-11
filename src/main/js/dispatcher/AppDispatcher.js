'use strict';
var Dispatcher = require('flux').Dispatcher;
var invariant = require('react/lib/invariant');


var AppDispatcher = Object.assign(new Dispatcher(), {

    /**
     * A bridge function between the views and the dispatcher, marking the action
     * as a view action.
     * @param  {object} action The data coming from the view.
     */
    handleViewAction: function(action) {
        // console.log('AppDispatcher::handleViewAction: %s', action.type);

        if ("production" !== process.env.NODE_ENV) {
            invariant(action.type, 'Expected there to be an action.type');
        }

        this.dispatch({
            source: 'VIEW_ACTION',
            action: action
        });
    },

    /**
     * A bridge function between the views and the dispatcher, marking the action
     * as a request action.
     * @param  {object} action The data coming from the request response.
     */
    handleRequestAction: function(action) {
        // console.log('AppDispatcher::handleRequestAction: %s', action.type);

        if ("production" !== process.env.NODE_ENV) {
            invariant(action.type, 'Expected there to be an action.type');
        }

        this.dispatch({
            source: 'REQUEST_ACTION',
            action: action
        });
    }

});

module.exports = AppDispatcher;
