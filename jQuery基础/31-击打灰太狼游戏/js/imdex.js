$(function () {
    $('.rules').click(function () { //让规则打开
        $('.rule').stop().fadeIn(100);
    })
    $('.close').click(function () { //让规则关闭
        $('.rule').stop().fadeOut(100);
    })

    $('.start').click(function () { //监听开始按钮
        $(this).stop().fadeOut(100); //让监听按钮消失
        start_progress(); //打开进度条
        startWolfAnimation(); //开启动画



    })

    function start_progress() { //进度条打开函数
        $('.progress').width(180);
        window.progress_width = $('.progress').width();
        var timer = setInterval(function () {
            progress_width -= 1;
            $('.progress').width(progress_width + 'px'); //让进度条不断减少
            if (progress_width <= 0) {
                clearInterval(timer);
                $('.mask').fadeIn(100);
                stopWolfAnimation(); //停止动画
                $('.endScore').text($('.score').text() + '分'); //取得最后的分数
            }
        }, 100)



    }
    $('.reStart').click(function () { //重新开始游戏
        $('.mask').fadeOut(100); //让遮罩层消失
        start_progress(); //打开进度条
        startWolfAnimation(); //开启游戏
        score = 0;
        $('.score').text(score);
    })
    var wolfTimer; //定时器变量
    function startWolfAnimation() { //开启动画
        //两个数组用来保存所有灰太狼和小灰灰的图片
        var wolf_1 = ['./images/h0.png', './images/h1.png', './images/h2.png', './images/h3.png', './images/h4.png', './images/h5.png', './images/h6.png', './images/h7.png', './images/h8.png', './images/h9.png'];
        var wolf_2 = ['./images/x0.png', './images/x1.png', './images/x2.png', './images/x3.png', './images/x4.png', './images/x5.png', './images/x6.png', './images/x7.png', './images/x8.png', './images/x9.png'];
        //定义一个数组用来保存所有可能出现的位置
        var arrPos = [
            { left: "100px", top: "115px" },
            { left: "20px", top: "160px" },
            { left: "190px", top: "142px" },
            { left: "105px", top: "193px" },
            { left: "19px", top: "221px" },
            { left: "202px", top: "212px" },
            { left: "120px", top: "275px" },
            { left: "30px", top: "295px" },
            { left: "209px", top: "297px" }
        ];
        //创建一个图片
        var $img = $('<img src="" class="wolfimages">'); //创建图片标签
        //随机获取一个位置
        var $imgPos = arrPos[getIntRandom(0, 8)] //随机取出的是一个对象
        $img.css({ //创建其位置
            position: 'absolute',
            left: $imgPos.left, //赋值其位置
            top: $imgPos.top
        })
        var wolfType = getIntRandom(0, 1); //随机一个数用来控制灰太狼与小灰灰的出现
        wolfType == 0 ? wolfType = wolf_1 : wolfType = wolf_2;
        window.wolfIndex = 0; //让图片依次出现
        window.wolfIndexEnd = 5;
        window.speed = 200;
        if ($('.score').text() >= 150) { //让其速度随分数增加
            window.speed = 120;
        } else if ($('.score').text() >= 120) {
            window.speed = 140;
        } else if ($('.score').text() >= 80) {
            window.speed = 160;
        } else if ($('.score').text() >= 50) {
            window.speed = 180;
        }
        console.log(window.speed);
        wolfTimer = setInterval(function () {
            if (wolfIndex >= wolfIndexEnd) {
                clearInterval(wolfTimer); //停止定时器
                $img.remove(); //删除出现的灰太狼
                startWolfAnimation(); //再次开启动画
            }
            $img.attr('src', wolfType[wolfIndex]); //不断改变图片的src地址
            wolfIndex++;
            // $('.container').append($img); //将图片放入主页面


        }, window.speed)

        $('.container').append($img); //将图片放入主页面
        gamerules($img);
    }
    function gamerules($img) { //监听图片的点击
        $img.one('click', function () {
            window.wolfIndex = 5;
            window.wolfIndexEnd = 9;
            var src = $(this).attr('src'); //获取到图片的src地址
            // console.log(src);
            var flag = src.indexOf('h') > 0; //判断是灰太狼还是小灰灰
            // console.log(flag);
            if (flag) {
                $('.score').text(parseInt($('.score').text()) + 10);
                progress_width += 30;
            } else {
                $('.score').text(parseInt($('.score').text()) - 10);
            }
        })



    }
    function stopWolfAnimation() { //停止动画
        $('.wolfimages').remove();
        clearInterval(wolfTimer);
    }
    function getIntRandom(min, max) { //定义一个随机数函数
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }




})