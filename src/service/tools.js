angular.module('angular-jwt-auth-module.tools', [])
.provider('angularJwtAuthTools', function() {

    this.urlLoginCheck = '/login_check';
    this.urlTokenRefresh = '/token/refresh';

    /**
     * Get the login & password.
     *
     * @return object
     */
    this.credentialsRetriever = function() { };


    /**
     * Get the current local tokens.
     *
     * @return object
     */
    this.existingTokenRetriever = function() { };

    /**
     * Ask for a new token at the server.
     *
     * @return object
     */
    this.tokenRetriever = function() { };

    /**
     * Save the tokens locally.
     *
     * @param object tokens
     */
    this.tokenSaver = function() { };

    /**
     * Remove the tokens.
     *
     * @return object
     */
    this.tokenRemover = function() { };

    this.$get = function() {
        return {
            credentialsRetriever: this.credentialsRetriever,
            tokenRetriever: this.tokenRetriever,
            existingTokenRetriever: this.existingTokenRetriever,
            tokenSaver: this.tokenSaver,
            tokenRemover: this.tokenRemover
        };
    };

})

.config(function(angularJwtAuthToolsProvider) {

    angularJwtAuthToolsProvider.credentialsRetriever = ['localStorageService', function(localStorageService) {

        if (localStorage.getItem('auth.username') === null || localStorage.getItem('auth.password') === null) {
            return null;
        }

        return {
            username: localStorageService.get('auth.username'),
            password: localStorageService.get('auth.password')
        };
    }];

    angularJwtAuthToolsProvider.tokenSaver = ['localStorageService', function(localStorageService) {
        localStorageService.set('auth.jwt_token', this.token);
        localStorageService.set('auth.jwt_refresh_token', this.refresh_token);
    }];

    angularJwtAuthToolsProvider.existingTokenRetriever = ['localStorageService', function(localStorageService) {
        return {
            token: localStorageService.get('auth.jwt_token'),
            refreshToken: localStorageService.get('auth.jwt_refresh_token')
        };
    }];

    angularJwtAuthToolsProvider.tokenRemover = ['localStorageService', function(localStorageService) {
        localStorageService.remove('auth.jwt_token', 'auth.jwt_refresh_token');
    }];

    angularJwtAuthToolsProvider.tokenRetriever = ['$http', 'WsService', function($http, WsService) {
        // We don't send Authorization headers
        return $http.post(angularJwtAuthToolsProvider.urlLoginCheck, this, {ignoreAuthModule: true, skipAuthorization: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}, transformRequest: WsService.objectToURLEncoded});
    }];

});
