/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * AppDispatcher
 *
 * A singleton that operates as the central hub for application updates.
 */

var Dispatcher = require('flux').Dispatcher;

var copyProperties = require('react/lib/copyProperties');

var AppDispatcher = copyProperties(new Dispatcher(), {

    /**
     * A bridge function between the views and the dispatcher, marking the action
     * as a view action.
     * @param  {object} action The data coming from the view.
     */
    handleViewAction: function(action) {
        console.log('AppDispatcher::handleViewAction: %s', action.actionType);
        this.dispatch({
            source: 'VIEW_ACTION',
            action: action
        });
    },


    /**
     * A bridge function between the views and the dispatcher, marking the action
     * as a request action.
     * @param  {object} action The data coming from the view.
     */
    handleRequestAction: function(action) {
        console.log('AppDispatcher::handleRequestAction: %s', action.actionType);
        this.dispatch({
            source: 'REQUEST_ACTION',
            action: action
        });
    }

});

module.exports = AppDispatcher;
