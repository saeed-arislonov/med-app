angular.module('starter.factories', [])
.factory('orderCount', function($http){
    
    return {
        total : "",
        orderCount : function(){
            $http.get('../data/cart.json')
                .success(function(data){
                return data.length
            })
        },
        updateCount : function(){
           return $http.get('../data/cart.json');
        }
    }
    
})
