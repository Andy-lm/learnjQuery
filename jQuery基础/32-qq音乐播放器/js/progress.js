(function (window) {
    function Progress($progressBar, $progressLine, $progressDot) {
        return new Progress.prototype.init($progressBar, $progressLine, $progressDot);
    }
    Progress.prototype = {
        constructor: Progress,
        init: function ($progressBar, $progressLine, $progressDot) { //在原型对象里设置一个初始化函数，在实例时直接调用
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        isMove: false,
        ProgressClick: function (callBack) { //进度条的点击
            var $this = this; //这个this指向的是外部实例化对象progress
            this.$progressBar.click(function (event) {
                var normalLeft = $(this).offset().left;
                var eventLeft = event.pageX;
                var progressLength = eventLeft - normalLeft;
                if (progressLength >= 0 && progressLength <= $this.$progressBar.width() - $this.$progressDot.width()) {
                    $this.$progressLine.css('width', eventLeft - normalLeft);
                    $this.$progressDot.css('left', eventLeft - normalLeft);
                    var value = progressLength / $(this).width();
                    callBack(value);
                }

            })
        },
        ProgressMove: function (callBack) { //进度条的拖拽
            var $this = this;
            var eventLeft;
            var normalLeft = this.$progressBar.offset().left;
            var value;
            this.$progressBar.mousedown(function (event) { //鼠标按下
                $this.isMove = true;
                eventLeft = event.pageX;
                $(document).mousemove(function (event) { //鼠标移动
                    eventLeft = event.pageX;
                    var progressLength = eventLeft - normalLeft;
                    if (progressLength >= 0 && progressLength <= $this.$progressBar.width() - $this.$progressDot.width()) {
                        $this.$progressLine.css('width', eventLeft - normalLeft);
                        $this.$progressDot.css('left', eventLeft - normalLeft);
                    }

                });
                $(document).mouseup(function () { //监听鼠标弹起
                    //这里必须删除掉所有的监听事件，不然会有bug
                    $(document).off("mousemove").off("mouseup").off("mousedown");
                    $this.isMove = false;
                    value = (eventLeft - normalLeft) / $this.$progressBar.width();
                    callBack(value);
                });
            })
        },

        setProgress: function (value) { //
            if (this.isMove) return;
            if (value < 0 || value > 100) return;
            this.$progressLine.css({
                width: value + '%'
            });
            this.$progressDot.css({
                left: value + '%'
            });

        },
    }



    //让Player的原生对象的init函数的原生对象的constructor,指向Player的原生对象
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress; //将闭包里的原型对象变成全局对象



})(window)