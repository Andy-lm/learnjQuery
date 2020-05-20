$(function () {
    // $('.center').delegate('.comment', 'propertychange input', function () {
    //     alert(11)
    // })
    $('.comment').on('propertychange input', function () { //监听input元素value值的实时改变，并控制按钮的使用

        if ($(this).val().length > 0) { //输入内容时让按钮变为可用
            $('.send').prop('disabled', false);

        } else {
            $('.send').prop('disabled', true);
        }
    })

    // var number = $.getCookie('pageNumber') || 1;
    var number = window.location.hash.substr(1) || 1;
    // 获取页数
    getMsgPage();
    function getMsgPage() { // weibo.php?act=get_page_count	获取页数
        $('.page').html('');
        $.ajax({ // type, url, data, timeout, success, error
            type: 'get',
            url: 'weibo.php',
            data: 'act=get_page_count',
            success: function (msg) {
                var obj = eval("(" + msg + ")");
                console.log(obj);

                for (var i = 0; i < obj.count; i++) {
                    var $a = $("<a href=\"javascript:;\">" + (i + 1) + "</a>")
                    if (i === (number - 1)) {
                        $a.addClass('cur');
                    }
                    $('.page').append($a);
                }

            },
            error: function (xhr) {
                alert(xhr.status)
            }
        })


    }


    // 默认显示第一页
    getMsgList(number);
    function getMsgList(number) { // weibo.php?act=get&page=1	获取一页数据
        $('.messageList').html('');
        $.ajax({ // type, url, data, timeout, success, error 
            type: 'get',
            url: 'weibo.php',
            data: 'act=get&page=' + number,
            success: function (msg) {
                var obj = eval("(" + msg + ")");
                $(obj).each(function (key, value) {
                    var $weibo = creatEle(value);
                    $weibo.get(0).obj = value;
                    $('.messageList').append($weibo); //给messageList添加子节点
                })

            },
            error: function (xhr) {
                console.log(xhr.status);

            }
        })


    }

    $('.send').click(function () { //监听发布按钮的点击
        // 获取用户输入的数据
        var $text = $('.comment').val();
        $.ajax({ // type, url, data, timeout, success, error
            type: 'get',
            url: 'weibo.php',
            data: "act=add&content=" + $text,
            success: function (msg) {
                /* 
                {error: 0, id: 3, time: 1589860198, acc: 0, ref: 0} 
                {error:0, id: 新添加内容的ID, time: 添加时间}
                */
                // console.log(msg);
                var obj = eval("(" + msg + ")");
                // var obj = JSON.parse(msg);
                obj.content = $text;
                // 添加一条微博
                var $weibo = creatEle(obj);
                $weibo.get(0).obj = obj;
                $('.messageList').prepend($weibo); //给messageList添加子节点
                $('.comment').val('');
                // 在重新发送微博后需要再次获取一下页数
                getMsgPage();
                if ($('.info').length > 6) {
                    $('.info:last-child').remove();
                }
                getMsgList(1);
            },
            error: function (xhr) {
                console.log(xhr.status);
            }
        })

    })

    $('body').keydown(function (e) { //监听键盘的回车键
        if (e.keyCode == 13 && $('.send').prop('disabled') == false) {
            $('.send').trigger('click');
        }
        // console.log(e.keyCode);

    })
    function creatEle(obj) { //生成要添加的对象
        var $weibo = $("<div class=\"info\">\n" +
            "            <p class=\"infoText\">" + obj.content + "</p>\n" +
            "            <p class=\"infoOperation\">\n" +
            "                <span class=\"infoTime\">" + formartDate(obj.time) + "</span>\n" +
            "                <span class=\"infoHandle\">\n" +
            "                    <a href=\"javascript:;\" class='infoTop'>" + obj.acc + "</a>\n" +
            "                    <a href=\"javascript:;\" class='infoDown'>" + obj.ref + "</a>\n" +
            "                    <a href=\"javascript:;\" class='infoDel'>删除</a>\n" +
            "                </span>\n" +
            "            </p>\n" +
            "        </div>");
        return $weibo;
    }

    function formartDate(time) { //初始化格式时间
        var data = new Date(time * 1000);
        // console.log(data.getFullYear());
        // console.log(data.getMonth() + 1);
        // console.log(data.getDate());
        // console.log(data.getHours());
        // console.log(data.getMinutes());
        // console.log(data.getSeconds());
        var arr = [data.getFullYear() + '-', data.getMonth() + 1 + '-', data.getDate() + ' ', data.getHours() + ':', data.getMinutes() + ':' + data.getSeconds()];
        var data_str = arr.join('');
        return data_str;
    }

    $('body').delegate('.infoTop', 'click', function () { //新创建的元素用委托监听，顶
        // console.log($(this).text());
        var int_info = parseInt($(this).text());
        $(this).text(int_info + 1);
        var obj = $(this).parents('.info');
        var id = obj.get(0).obj.id;

        /*
        weibo.php?act=acc&id=12		顶某一条数据
        返回：{error:0} 
        */
        $.ajax({ // type, url, data, timeout, success, error
            type: 'get',
            url: 'weibo.php',
            data: 'act=acc&id=' + id,
            success: function (msg) {
                console.log(msg);
            },
            error: function (xhr) {
                alert(xhr.status)
            }
        })




    })
    $('body').delegate('.infoDown', 'click', function () { //新创建的元素用委托监听，踩
        // console.log($(this).text());
        var int_info = parseInt($(this).text());
        $(this).text(int_info + 1);

        var obj = $(this).parents('.info');
        var id = obj.get(0).obj.id;
        /*
        weibo.php?act=ref&id=12			踩某一条数据
        返回：{error:0} 
        */
        $.ajax({ // type, url, data, timeout, success, error
            type: 'get',
            url: 'weibo.php',
            data: 'act=ref&id=' + id,
            success: function (msg) {
                console.log(msg);
            },
            error: function (xhr) {
                alert(xhr.status)
            }
        })
    })

    $('body').delegate('.infoDel', 'click', function () { //新创建的元素用委托监听，顶
        // console.log($(this).text());
        $(this).parents('.info').remove();

        var obj = $(this).parents('.info');
        var id = obj.get(0).obj.id;
        /*
        weibo.php?act=del&id=12			删除一条数据
        返回：{error:0} 
        */
        $.ajax({ // type, url, data, timeout, success, error
            type: 'get',
            url: 'weibo.php',
            data: 'act=del&id=' + id,
            success: function (msg) {
                console.log(msg);
                getMsgPage();
            },
            error: function (xhr) {
                alert(xhr.status)
            }
        })
        // 删除数据后让其刷新一下页数
        getMsgList($('.cur').html());
    })

    $('body').delegate('.page>a', 'click', function () {
        getMsgList($(this).html());
        $(this).addClass('cur');
        $(this).siblings().removeClass('cur');
        // $.addCookie('pageNumber', $(this).html())
        window.location.hash = $(this).html();
    })








})