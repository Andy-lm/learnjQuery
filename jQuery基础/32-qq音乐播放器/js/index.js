$(function () {
    // 1，自定义滚动条
    $(".content_list").mCustomScrollbar();

    //2，加载歌曲列表
    var $audio = $('audio'); //获取音乐播放标签
    var player = new Player($audio); //实例化对象
    var $progress;
    var $voiceProgress;
    var lyric;

    getPlayerList();
    function getPlayerList() { //获取并加载歌曲信息
        $.ajax({
            url: "../source/musiclist.json",
            dataType: "json",

            success: function (date) { //data是获取到的数据
                player.musicList = date; //给对象的属性赋值
                var $music_list = $('.content_list ul'); //获取到需要添加节点的父元素
                $.each(date, function (index, ele) {
                    var $item = creatMusicItem(index, ele);
                    $music_list.append($item); //将歌曲放入列表中
                }),
                    initMusicInfo(date[0]); //默认加载第0首歌曲信息
                initMusicLyric(date[0]); //第0首歌曲歌词
            },
            error: function (e) {
                console.log(e);
            }
        })
    };
    function initMusicInfo(music) { //加载歌曲信息
        var $musicImage = $('.song_info_pic img');
        var $musicName = $('.song_info_name a');
        var $musicSinger = $('.song_info_singer a');
        var $musicAlbum = $('.song_info_ablum a');
        var $musicProgressName = $('.music_progress_name');
        var $musicProgressTime = $('.music_progress_time');
        var $musicBg = $('.mask_bg');

        $musicImage.attr('src', music.cover); //加载歌曲图片，歌曲信息
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAlbum.text(music.album);
        $musicProgressName.text(music.name + ' / ' + music.singer);
        $musicProgressTime.text('00:00' + ' / ' + music.time);
        $musicBg.css('background', "url(" + music.cover + ")");
    };
    function initMusicLyric(music) { //加载歌词信息
        lyric = new Lyric(music.link_lrc);
        var $lyricContainer = $('.song_lyric');
        $lyricContainer.html(''); //清空上一首歌的歌词
        lyric.loadLyric(function () {
            $.each(lyric.lyrics, function (index, ele) {
                var $item = $('<li>' + ele + '</li>');
                $lyricContainer.append($item);
            })
        });
    }
    initProgress();
    function initProgress() { //初始化播放进度条
        //播放进度条
        var $progressBar = $('.music_progress_bar'); //获取拖动进度条
        var $progressLine = $('.music_progress_line');
        var $progressDot = $('.music_progress_dot');
        $progress = Progress($progressBar, $progressLine, $progressDot);
        $progress.ProgressClick(function (value) {
            player.musicSeekTo(value);
        });
        $progress.ProgressMove(function (value) {
            player.musicSeekTo(value);
        });
    };
    initVoiceProgress();
    function initVoiceProgress() { //初始化声音进度条
        //声音进度条
        var $voiceBar = $('.music_voice_bar'); //获取拖动进度条
        var $voiceLine = $('.music_voice_line');
        var $voiceDot = $('.music_voice_dot');
        $voiceProgress = Progress($voiceBar, $voiceLine, $voiceDot);
        $voiceProgress.ProgressClick(function (value) {
            player.musicVoiceSeekTo(value);
        });
        $voiceProgress.ProgressMove(function (value) {
            player.musicVoiceSeekTo(value);
        });
    }
    //3，初始化事件监听
    initEvents();
    function initEvents() {

        // 进行事件委托，监听子菜单
        $('.content_list').delegate('.list_music', 'mouseenter', function () {
            $(this).find('.list_menu').stop().fadeIn(50);
            $(this).find('.list_time span').stop().fadeOut(50);
            $(this).find('.list_time a').stop().fadeIn(50);
        });
        $('.content_list').delegate('.list_music', 'mouseleave', function () {
            $(this).find('.list_menu').stop().fadeOut(50);
            $(this).find('.list_time span').stop().fadeIn(50);
            $(this).find('.list_time a').stop().fadeOut(50);
        });
        // 监听复选框
        $('.content_list').delegate('.list_check', 'click', function () {
            $(this).toggleClass('list_checked');
        });


        var $music_play = $('.music_play'); //找到底部播放按钮
        $('.content_list').delegate('.list_menu_play', 'click', function () { //监听菜单的播放按钮
            var $this_music = $(this).parents('.list_music');

            // console.log($this_music.get(0).index); //输出当前歌曲相关信息
            // console.log($this_music.get(0).music);


            // 让其他按钮复原
            $this_music.siblings().find('.list_menu_play')
                .removeClass('list_menu_play2');
            $(this).toggleClass('list_menu_play2');
            $this_music.siblings().find('div').css('color', 'rgba(255, 255, 255, 0.5)')
            // $music_play.toggleClass('music_play2'); //切换底部播放图标
            if ($(this).attr('class').indexOf('list_menu_play2') != -1) {
                $music_play.addClass('music_play2'); //播放按钮
                $this_music.find('div').css('color', '#fff') //文字颜色

            } else {
                $music_play.removeClass('music_play2');
                $this_music.find('div').css('color', 'rgba(255, 255, 255, 0.5)')
            }
            $this_music.siblings().find('.list_number').removeClass('list_number2'); //取消数字的显示
            $this_music.find('.list_number').toggleClass('list_number2');
            //将当前点击的音乐的索引和信息传送给我们的播放音乐函数
            player.playMusic($this_music.get(0).index, $this_music.get(0).music); //播放当前点击的歌曲
            initMusicInfo($this_music.get(0).music); //修改显示音乐信息
            initMusicLyric($this_music.get(0).music); //修改音乐歌词信息
        })

        // 监听底部按钮的点击
        $music_play.click(function () {
            if (player.currentIndex == -1) { //判断是不是没有播放过音乐
                $('.list_music').eq(0).find('.list_menu_play').trigger('click'); //让第一首歌曲播放
            } else { //让当前的音乐播放
                $('.list_music').eq(player.currentIndex).find('.list_menu_play').trigger('click');
            }
        })
        //监听上一首音乐的点击
        $('.music_pre').click(function () {
            $('.list_music').eq(player.preIndex()).find('.list_menu_play').trigger('click');
        })
        //监听下一首音乐的点击
        $('.music_next').click(function () {
            $('.list_music').eq(player.nextIndex()).find('.list_menu_play').trigger('click');
        })
        // 监听删除按钮
        $('.content_list').delegate('.list_menu_del', 'click', function () {
            var $this_Music = $(this).parents('.list_music');
            if ($this_Music.get(0).index == player.currentIndex) {
                $('.music_next').trigger('click');
            }
            $this_Music.remove(); //将该元素删除
            player.changeMusic($this_Music.get(0).index); //将指定元素从后台中删除
            $('.list_music').each(function (index, ele) { //重新排序
                ele.index = index; //改变每一个元素的索引属性
                $(ele).find('.list_number').text(index + 1);
            })
        })
        //监听播放时长
        $audio.on('timeupdate', function () {
            // console.log(player.getMusicDuration(), player.getMusicCurrentTime());
            var duration = player.getMusicDuration();
            var currentTime = player.getMusicCurrentTime();
            var timeStr = formateDate(duration, currentTime) //格式化播放时长

            $('.music_progress_time').text(timeStr); //同步当前歌曲信息
            var value = currentTime / duration * 100;
            $progress.setProgress(value);
            var index = lyric.currentIndex(currentTime); //获取当前歌词对应的索引
            var $item = $('.song_lyric li').eq(index); //让当前歌词高亮
            $item.addClass('cur');
            $item.siblings().removeClass('cur');
            if (index <= 2) return; //让其从第三句歌词开始滚动
            $('.song_lyric').css({
                marginTop: (-index + 2) * 30,
            });




        })
        //监听声音按钮的点击
        $('.music_voice_icon').click(function () {
            $(this).toggleClass('music_voice_icon2');
            if ($(this).attr('class').indexOf('music_voice_icon2') != -1) {
                player.musicVoiceSeekTo(0);
            } else {
                player.musicVoiceSeekTo(1);
            }
        })
    };

    function formateDate(duration, currentTime) { //格式化播放时长函数
        var endMin = parseInt(duration / 60); //分钟
        endMin = endMin < 10 ? '0' + endMin : endMin;
        var endSec = parseInt(duration % 60); //秒
        endSec = endSec < 10 ? '0' + endSec : endSec;


        var currentMin = parseInt(currentTime / 60); //分钟
        currentMin = currentMin < 10 ? '0' + currentMin : currentMin;
        var currentSec = parseInt(currentTime % 60); //秒
        currentSec = currentSec < 10 ? '0' + currentSec : currentSec;

        return currentMin + ':' + currentSec + ' / ' + endMin + ':' + endSec;

    }

    function creatMusicItem(index, music) { //将遍历得到的数据插入到我们需要的标签中，创建每一条歌曲
        var $music = $("" +
            "<li class=\"list_music\">\n" +
            "<div class=\"list_check\"><i></i></div>\n" +
            "<div class=\"list_number\">" + (index + 1) + "</div>\n" +
            "<div class=\"list_name\">" + music.name + "" +
            "     <div class=\"list_menu\">\n" +
            "          <a href=\"javascript:;\" title=\"播放\" class='list_menu_play'></a>\n" +
            "          <a href=\"javascript:;\" title=\"添加\"></a>\n" +
            "          <a href=\"javascript:;\" title=\"下载\"></a>\n" +
            "          <a href=\"javascript:;\" title=\"分享\"></a>\n" +
            "     </div>\n" +
            "</div>\n" +
            "<div class=\"list_singer\">" + music.singer + "</div>\n" +
            "<div class=\"list_time\">\n" +
            "     <span>" + music.time + "</span>\n" +
            "     <a href=\"javascript:;\" title=\"删除\" class='list_menu_del'></a>\n" +
            "</div>\n" +
            "</li>");

        $music.get(0).index = index; //将我们遍历得到的索引以及歌曲内容以属性的方式添加给li
        $music.get(0).music = music;


        return $music;
    }






















})