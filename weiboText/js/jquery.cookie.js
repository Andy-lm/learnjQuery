; (function ($, window) {
    $.extend({
        addCookie: function (key, value, day, path, domain) {
            // 处理路径
            var index = window.location.pathname.lastIndexOf('/');
            var currentPath = window.location.pathname.slice(0, index);
            path = path || currentPath;
            // 处理域名
            domain = domain || document.domain;
            // 处理时间
            if (!day) {
                document.cookie = key + "=" + value + ";path=" + path + ";domain=" + domain + ";";
            } else {
                var date = new Date();
                date.setDate(date.getDate() + day);
                document.cookie = key + "=" + value + ";expires=" + date.toGMTString() + ";path=" + path + ";domain=" + domain + ";";
            }
        },
        getCookie: function (key) {
            var res = document.cookie.split(';');
            for (var i = 0; i < res.length; i++) {
                var temp = res[i].split('=');
                if (temp[0].trim() === key) {
                    return temp[1];
                }
            }
        },
        delCookie: function (key, path) {
            addCookie(key, getCookie(key), -1, path);
        }
    });








})(jQuery, window);