define(function(){
   return {
       get: function(name, defaultValue) {
           var value = localStorage.getItem(name);
           return value === null ? defaultValue : value;
       },

       set : function(name, value) {
           localStorage.setItem(name, value);
       }
   };
});