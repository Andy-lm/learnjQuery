//定义一个立即执行函数
(function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor: Player,
        musicList: [],
        init: function ($audio) { //在原型对象里设置一个初始化函数，在实例时直接调用
            this.$audio = $audio;
            this.audio = $audio.get(0); //js的原生对象
        },
        currentIndex: -1,
        playMusic: function (index, music) {
            if (this.currentIndex == index) { //如果是同一首歌曲
                if (this.audio.paused) {
                    this.audio.play(); //让其播放
                } else {
                    this.audio.pause(); //让其暂停
                };
            } else { //如果不是同一首歌
                this.$audio.attr('src', music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }


        },
        preIndex: function () { //播放上一首
            var index = this.currentIndex - 1;
            if (index < 0) {
                index = this.musicList.length - 1;
            }
            return index;
        },
        nextIndex: function () { //播放下一首
            var index = this.currentIndex + 1;
            if (index >= this.musicList.length) {
                index = 0;
            }
            return index;
        },

        changeMusic: function (index) {
            this.musicList.splice(index, 1); //删除数组第一个为我们需要删除的起始索引号，第二个为我们要删除的个数
            if (index < this.currentIndex) {
                this.currentIndex -= 1;
            }
        },
        getMusicDuration: function () { //获取播放时长
            return this.audio.duration;
        },
        getMusicCurrentTime: function () { //获取当前时间
            return this.audio.currentTime;
        },
        musicSeekTo: function (value) {
            if (isNaN(value)) return;
            this.audio.currentTime = this.audio.duration * value;
        },
        musicVoiceSeekTo: function (value) {
            if (isNaN(value)) return;
            if (value < 0 || value > 1) return;
            this.audio.volume = value;
        }


    }



    //让Player的原生对象的init函数的原生对象的constructor,指向Player的原生对象
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player; //将闭包里的原型对象变成全局对象



})(window)