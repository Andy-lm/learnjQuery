(function (window) {
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor: Lyric,
        init: function (path) { //在原型对象里设置一个初始化函数，在实例时直接调用
            this.path = path;
        },
        lyrics: [], //一个存时间
        times: [], //一个存歌词
        index: -1,
        loadLyric: function (callBack) {
            var $this = this;
            $.ajax({
                url: $this.path,
                dataType: "text",
                success: function (date) { //data是获取到的数据
                    $this.parseLyric(date);
                    callBack();
                },
                error: function (e) {
                    console.log(e);
                }
            })
        },
        parseLyric: function (date) { //拆分歌词
            var $this = this;
            $this.times = []; //清空上一首歌的歌词和时间
            $this.lyrics = [];
            var array = date.split('\n'); //将字符串转化为数组
            var timeReg = /\[(\d*:\d*\.\d*)\]/;
            $.each(array, function (index, ele) {
                //将歌词存入数组
                var lrc = ele.split(']')[1];
                //排除空字符串的影响
                if (lrc.length == 1) return true;
                $this.lyrics.push(lrc);
                //正则表达式获取时间
                var res = timeReg.exec(ele);
                if (res == null) return true;
                var timeStr = res[1];
                var res2 = timeStr.split(':');
                var min = parseInt(res2[0]) * 60;
                var sec = parseFloat(res2[1]);
                var time = parseFloat(Number(min + sec).toFixed(2));
                $this.times.push(time); //将时间转换为毫秒数传入数组

            })










        },
        currentIndex: function (currentTime) { //歌曲进度调整，删除前面的歌词
            if (currentTime >= this.times[0]) {
                this.index++;
                this.times.shift(); //删除数组中最前面的数
            }
            return this.index;

        }


    }



    //让Player的原生对象的init函数的原生对象的constructor,指向Player的原生对象
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric; //将闭包里的原型对象变成全局对象



})(window)