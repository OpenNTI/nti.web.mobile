/**
* Collection of methods for handling responses from the dataserver related to logins.
* @class ResponseHandlers
*/

var merge = require('react/lib/merge');

var ResponseHandlersBase = function(loginStore) {
	this.loginStore = loginStore;
}

var ResponseHandlers = merge(ResponseHandlersBase.prototype, {

	/**
	* Handles a 'pong' response from a call to dataserver 'ping'.
	* If the pong includes a handshake link and we have a username
	* this method will send the handshake request.
	* @method pong
	* @param {mixed} response The response from the call.
	*/
	pong: function(response) {
		debugger;
		if(response && response.hasOwnProperty('Links')) {
			// index the links by their 'rel' attr
			var links_by_rel = Utils.indexArrayByKey(response['Links'],'rel');
			LoginController.setState({links: links_by_rel});
		}
		if(LoginController.getHref(LoginConstants.LOGIN_CONTINUE_LINK)) {
			LoginController.setLoggedIn(true);
			return;
		}
		var username = LoginController.state.username || '';
		var password = LoginController.state.password || '';
		var handshakeLink = LoginController.getHref(LoginConstants.HANDSHAKE_LINK);
		if(handshakeLink && username.length > 0) {
			var auth = {
				username: username,
				password: password,
				remember: true
			};
			Utils.call(handshakeLink,auth,ResponseHandlers.handshake);
		}
	},

	/**
	* General-purpose failure handler.
	* @method fail
	*/
	fail:function(response) {
		console.log('Ajax call failed.');
	},

	/**
	* Handles response from a call to a dataserver password login attempt.
	* @method login
	* @param {mixed} response The response from the call.
	*/
	login: function(response) {

		function isSuccess(res) {
			switch(typeof response) {
				case 'number':
					if (response == HttpStatusCodes.NO_CONTENT || response == HttpStatusCodes.NO_CONTENT_IE8) {
						console.log('Login successful');
						return true;
					}
					return false;
				break;

				case 'object':
					return !!response.success;
				break;
			}
			return false;
		}

		LoginController.setLoggedIn(isSuccess(response));
	},


	
	/**
	* Handles response from a dataserver handshake call.
	* @method login
	* @param {mixed} response The response from the call.
	*/
	handshake: function(response) {
		if(response && response.hasOwnProperty('Links')) {
			// index the links by their 'rel' attr
			var links_by_rel = Utils.indexArrayByKey(response['Links'],'rel');
			LoginController.setState({links: links_by_rel});
		}
	}
});

module.exports = ResponseHandlers;
