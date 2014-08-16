/*
 * LoginActions
 */

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var LoginConstants = require('./LoginConstants');

var LoginActions = {

  begin: function() {
    AppDispatcher.handleViewAction({
      actionType: LoginConstants.LOGIN_BEGIN,
      samplePayloadProperty: 'this is just here to illustrate attaching a payload to an action.'
    });
  },

  log_in: function(credentials) {
  	AppDispatcher.handleViewAction({
  		actionType: LoginConstants.LOGIN_PASSWORD,
  		credentials: credentials
  	});
  }

};

module.exports = LoginActions;
