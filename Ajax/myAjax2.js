function obj2str(data) {
    // 将传递过来的参数转换为相应的格式存放在url地址后面
    data.t = new Date().getTime();
    var res = [];
    for (var key in data) {
        res.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    return res.join('&');
}

function ajax(option) { // type, url, data, timeout, success, error
    // 将传递过来的参数转化为相应的格式  ?userName=lm$userPwd=123456
    var str = obj2str(option.data);
    // 1，建立一个异步对象
    var xmlhttp;
    var timer;
    if (window.XMLHttpRequest) {// code for all new browsers
        xmlhttp = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {// code for IE5 and IE6
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (option.type.toLowerCase() === 'get') {
        // 2，设置请求方式与请求地址
        xmlhttp.open(option.type, option.url + '?' + str, true);
        // 3，发送请求
        xmlhttp.send();
    } else {
        xmlhttp.open(option.type, option.url, true);
        // POST请求必须建立一个请求头
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        // 发送内容写在send中
        xmlhttp.send(str);
    }

    // 4，监听状态变化
    xmlhttp.onreadystatechange = function () {
        clearInterval(timer);
        // 判断请求是否完成，且响应已就绪
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status >= 200 && xmlhttp.status < 300 || xmlhttp === 304) {
                // 5，请求正确返回结果
                // console.log(xmlhttp.responseText);
                // console.log('接收到服务器返回的数据');
                option.success(xmlhttp);
            } else {
                // console.log(xmlhttp.status);
                // console.log('没有接收到服务器返回的数据');
                option.error(xmlhttp);
            }
        }
    }
    if (option.timeout) {
        timer = setInterval(function () {
            // 在3000毫秒后中断请求
            console.log('中断请求');
            xmlhttp.abort();
            clearInterval(timer);
        }, option.timeout)
    }
}