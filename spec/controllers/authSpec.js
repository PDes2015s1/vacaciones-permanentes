'use strict';

describe("AuthCtrl", function() {

    var scope, controller;

    beforeEach(function(){
        module('vacaciones-permanentes')
    });

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        controller = $controller('AuthCtrl', { $scope: scope });
    }));

    it("sin usuario", function() {
        expect(scope.user).toEqual({});
    });
});