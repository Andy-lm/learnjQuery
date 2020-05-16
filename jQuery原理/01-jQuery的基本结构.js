(function (window, undefined) {
    var lmJQuery = function () {
        return new lmJQuery.prototype.init(); //返回原型对象的初始化函数
    }

    lmJQuery.prototype = {
        constructor: lmJQuery,





    }





    lmJQuery.prototype.init.prototype = lmJQuery.prototype; //让init的原型对象指向lmjQuery的对象
    window.lmJQuery = window.$ = lmJQuery; //让其变为全局变量
})(window)