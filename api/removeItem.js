Object.defineProperty(Array.prototype, "removeItem", {
    enumerable: false,
    value: function (itemToRemove) {
        var filteredArray = this.filter(function(item){
            return item !== itemToRemove;
        });
        return filteredArray;
    }
});
