$(function () {
    // $('.center').delegate('.comment', 'propertychange input', function () {
    //     alert(11)
    // })
    $('.comment').on('propertychange input', function () { //监听input元素value值的实时改变，并控制按钮的使用

        if ($(this).val().length > 0) { //输入内容时让按钮变为可用
            $('.send').prop('disabled', false);
            console.log($('.send').prop('disabled'));
        } else {
            $('.send').prop('disabled', true);
            console.log($('.send').prop('disabled'));
        }
    })

    $('.send').click(function () { //监听发布按钮的点击
        var $text = $('.comment').val();
        var $weibo = creatEle($text);
        $('.messageList').prepend($weibo); //给messageList添加子节点
    })

    $('body').keydown(function (e) { //监听键盘的回车键
        if (e.keyCode == 13 && $('.send').prop('disabled') == false) { 
            var $text = $('.comment').val();
            var $weibo = creatEle($text);
            $('.messageList').prepend($weibo);
        }
        // console.log(e.keyCode);

    })
    function creatEle($text) { //生成要添加的对象
        var $weibo = $("<div class=\"info\">\n" +
            "            <p class=\"infoText\">" + $text + "</p>\n" +
            "            <p class=\"infoOperation\">\n" +
            "                <span class=\"infoTime\">" + formartDate() + "</span>\n" +
            "                <span class=\"infoHandle\">\n" +
            "                    <a href=\"javascript:;\" class='infoTop'>0</a>\n" +
            "                    <a href=\"javascript:;\" class='infoDown'>0</a>\n" +
            "                    <a href=\"javascript:;\" class='infoDel'>删除</a>\n" +
            "                </span>\n" +
            "            </p>\n" +
            "        </div>");
        return $weibo;
    }

    function formartDate() { //初始化格式时间
        var data = new Date();
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
    })
    $('body').delegate('.infoDown', 'click', function () { //新创建的元素用委托监听，踩
        // console.log($(this).text());
        var int_info = parseInt($(this).text());
        $(this).text(int_info + 1);
    })

    $('body').delegate('.infoDel', 'click', function () { //新创建的元素用委托监听，顶
        // console.log($(this).text());
        $(this).parents('.info').remove();

    })










})