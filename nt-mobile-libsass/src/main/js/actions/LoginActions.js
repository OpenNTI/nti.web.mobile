/*
 * LoginActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var LoginConstants = require('../constants/LoginConstants');

var LoginActions = {

  begin: function() {
    AppDispatcher.handleViewAction({
      actionType: LoginConstants.LOGIN_BEGIN,
      samplePayloadProperty: 'this is just here to illustrate attaching a payload to an action.'
    });
  }

};

module.exports = LoginActions;
