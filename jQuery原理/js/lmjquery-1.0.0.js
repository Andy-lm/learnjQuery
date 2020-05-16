(function (window, undefined) {
    // 自动调用原生对象里的init方法
    var lmjQuery = function (selector) {
        // 返回原型对象的初始化函数
        return new lmjQuery.prototype.init(selector);
    }

    lmjQuery.prototype = {
        constructor: lmjQuery,
        init: function (selector) {
            // 去除元素前后的空格
            selector = lmjQuery.trim(selector);
            // 1，当输入为0，'',NaN,undefinded,null时返回一个空对象
            if (!selector) {
            } else if (lmjQuery.isFunction(selector)) {
                lmjQuery.ready(selector);
            }
            // 2，将传递进来的字符串转换为一个依次存储的伪数组
            else if (lmjQuery.isString(selector)) {
                if (lmjQuery.isHTML(selector)) {
                    // 1,根据代码片段创建元素
                    var temp = document.createElement('div');
                    temp.innerHTML = selector;
                    /* 2,将创建好的一级元素添加到jquery中
                    for (var i = 0; i < temp.children.length; i++) {
                        this[i] = temp.children[i]; //this为需要返回的元素
                    };
                    3,给其添加length属性
                    this.length = temp.children.length; */
                    [].push.apply(this, temp.children);

                } else {
                    var res = document.querySelectorAll(selector);
                    // for (var i = 0; i < res.length; i++) {
                    //     this[i] = res[i]; //this为需要返回的元素
                    // };
                    // // 3,给其添加length属性
                    // this.length = res.length;
                    [].push.apply(this, res);
                }
            } else if (lmjQuery.isArray(selector)) {
                //3，判断是否为一个数组
                //1,将自定义伪数组转换为真数组
                //2,将真数组转换为伪数组
                var arr = [].slice.call(selector);
                [].push.apply(this, arr);
                return this;
            } else {
                //4,其他
                this[0] = selector;
                this.length = 1;

            }
            return this;
        },
        jquery: '1.0.0',
        selector: '',
        length: 0,
        // 相当于[].push.apply(this);
        // 调用我jQuery的push方法相当于调用数组的push方法
        push: [].push,
        sort: [].sort,
        splice: [].splice,
        //伪数组转真数组
        toArray: function () {
            return [].slice.call(this);
        },
        //返回一个真数组或索引对应的原生节点
        get: function (num) {
            if (arguments.length === 0) {
                return this.toArray();
            } else if (num >= 0) {
                return this[num];
            } else {
                return this[this.length + num];
            }
        },
        eq: function (num) {
            if (arguments.length === 0) {
                return new lmjQuery();
            } else {
                //调用jQuery对象给其传递一个原生元素，返回一个jQuery对象
                return lmjQuery(this.get(num));
            }
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        each: function (fn) {
            return lmjQuery.each(this, fn);
        }
    }
    // 将extend里的方法添加到了lmjQuery的静态方法中
    lmjQuery.extend = lmjQuery.prototype.extend = function (obj) {
        for (var key in obj) {
            this[key] = obj[key];
        }
    }
    //工具方法
    lmjQuery.extend({
        /* 去除前后的空格
           不是字符串就不用去除 */
        trim: function (str) {
            if (!lmjQuery.isString(str)) {
                return str;
            }
            if (str.trim) {
                return str.trim()
            } else {
                return str.replace(/^\s+|\s+$/g, ''); //正则表达式
            }
        },
        // 判断是否为字符型
        isString: function (str) {
            return typeof str === 'string';
        },
        // 判断是否为标签型
        isHTML: function (str) {
            return str.charAt(0) == '<' && str.charAt(str.length - 1) == '>' && str.length >= 3;
        },
        isObject: function (sele) {
            return typeof sele === 'object';
        },
        isWindow: function (sele) {
            return sele === window;
        },
        isArray: function (sele) {
            if (lmjQuery.isObject(sele) && !lmjQuery.isWindow(sele) && 'length' in sele) {
                return true;
            } else {
                return false;
            }
        },
        isFunction: function (sele) {
            return typeof sele === 'function';
        },
        ready: function (fn) {
            // 判断DOM是否加载完毕
            if (document.readyState == 'complete') {
                fn();
            } else if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', function () {
                    fn();
                })
            } else {
                // 在ie6,7,8才支持的方法
                document.attachEvent('onreadystatechange', function () {
                    if (document.readyState == 'complete') {
                        fn();
                    }
                })
            }
        },
        each: function (obj, fn) {
            //数组或者伪数组
            if (lmjQuery.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    // var res = fn(i, obj[i]);
                    var res = fn.call(obj[i], i, obj[i]);
                    if (res === true) {
                        continue;
                    } else if (res === false) {
                        break;
                    }
                }
            }
            //对象用for in遍历
            else if (lmjQuery.isObject(obj)) {
                for (var key in obj) {
                    // var res = fn(key, obj[key]);
                    var res = fn.call(obj[key], key, obj[key]);
                    if (res === true) {
                        continue;
                    } else if (res === false) {
                        break;
                    }
                }
            }
            return obj;
        },
        map: function (obj, fn) {
            var res = [];
            if (lmjQuery.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    var temp = fn(obj[i], i);
                    if (temp) {
                        res.push(temp);
                    }
                }
            } else if (lmjQuery.isObject(obj)) {
                for (var key in obj) {
                    var temp = fn(obj[key], key);
                    if (temp) {
                        res.push(temp);
                    }
                }
            }
            return res;
        },
        // 考虑兼容性的情况下，获取元素的样式
        getStyle: function (dom, styleName) {
            if (window.getComputedStyle) {
                return window.getComputedStyle(dom)[styleName];
            } else {
                return dom.currentStyle[styleName];
            }
        },
        addEvent: function (dom, name, callBack) {
            if (dom.addEventListener) {
                dom.addEventListener(name, callBack);
            } else {
                dom.attachEvent('on' + name, callBack);
            }
        }
    })

    lmjQuery.prototype.extend({
        // 相当于给lmjQuery添加了一个静态方法
        empty: function () {
            this.each(function (key, value) {
                value.innerHTML = '';
            })
            return this;
        },
        remove: function (sele) {
            if (arguments.length === 0) {
                this.each(function (key, value) {
                    var parent = value.parentNode;
                    parent.removeChild(value);

                });
            } else { //有BUG
                var $this = this;
                // 1.根据传入的选择器找到对应的元素
                $(sele).each(function (key, value) {
                    // 2.遍历找到的元素, 获取对应的类型
                    var type = value.tagName;
                    // 3.遍历指定的元素
                    console.log(type);

                    $this.each(function (k, v) {
                        // 4.获取指定元素的类型
                        var t = v.tagName;
                        // 5.判断找到元素的类型和指定元素的类型
                        if (t === type) {
                            // 根据遍历到的元素找到对应的父元素
                            var parent = value.parentNode;
                            // 通过父元素删除指定的元素
                            parent.removeChild(value);
                        }
                    });
                })
            }

            return this;
        },
        html: function (content) {
            if (arguments.length === 0) {
                return this[0].innerHTML;
            } else {
                this.each(function (key, value) {
                    value.innerHTML = content;
                })
            }
        },
        text: function (content) {
            var res = '';
            if (arguments.length === 0) {
                this.each(function (key, value) {
                    res += value.innerText;
                })
                return res;
            } else {
                this.each(function (key, value) {
                    value.innerText = content;
                })
            }
        },
        appendTo: function (sele) {
            //统一的将传进来的元素转化为JQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            $target.each(function (key, value) {
                $this.each(function (k, v) {
                    if (key == 0) {
                        value.appendChild(v);
                        res.push(v);
                    } else {
                        var cloneSourceEle = v.cloneNode(true);
                        value.appendChild(cloneSourceEle);
                        res.push(cloneSourceEle);
                    }
                })
            })
            return $(res);
        },
        prependTo: function (sele) {
            //统一的将传进来的元素转化为JQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            $target.each(function (key, value) {
                $this.each(function (k, v) {
                    if (key == 0) {
                        value.insertBefore(v, value.firstChild);
                        res.push(v);
                    } else {
                        var cloneSourceEle = v.cloneNode(true);
                        value.insertBefore(cloneSourceEle, value.firstChild);
                        res.push(cloneSourceEle);
                    }
                })
            })
            return $(res);
        },
        append: function (sele) {
            //传递字符串时与appendTo不同，返回值与appendTo不同，调用者与参数不同
            if (lmjQuery.isString(sele)) {
                this[0].innerHTML += sele;
            } else {
                $(sele).appendTo(this);
            }
            return this;
        },
        prepend: function (sele) {
            //传递字符串时与appendTo不同，返回值与appendTo不同，调用者与参数不同
            if (lmjQuery.isString(sele)) {
                this[0].innerHTML = sele + this[0].innerHTML;
            } else {
                $(sele).prependTo(this);
            }
            return this;
        },
        insertBefore: function (sele) {
            //统一的将传进来的元素转化为JQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            $target.each(function (key, value) {
                var parent = value.parentNode;
                $this.each(function (k, v) {
                    if (key == 0) {
                        parent.insertBefore(v, value);
                        res.push(v);
                    } else {
                        var cloneSourceEle = v.cloneNode(true);
                        parent.insertBefore(cloneSourceEle, value);
                        res.push(cloneSourceEle);
                    }
                })
            })
            return $(res);
        },
        insertAfter: function (sele) {
            //统一的将传进来的元素转化为JQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            $target.each(function (key, value) {
                var parent = value.parentNode;
                var nextSiblings = value.nextSibling;
                $this.each(function (k, v) {
                    if (key == 0) {
                        parent.insertBefore(v, nextSiblings);
                        res.push(v);
                    } else {
                        var cloneSourceEle = v.cloneNode(true);
                        parent.insertBefore(cloneSourceEle, nextSiblings);
                        res.push(cloneSourceEle);
                    }
                })
            })
            return $(res);
        },
        after: function (sele) {
            //传递字符串时与appendTo不同，返回值与appendTo不同，调用者与参数不同
            if (lmjQuery.isString(sele)) {
                this[0].innerHTML += sele;
            } else {
                $(sele).insertAfter(this);
            }
            return this;
        },
        before: function (sele) {
            //传递字符串时与appendTo不同，返回值与appendTo不同，调用者与参数不同
            if (lmjQuery.isString(sele)) {
                this[0].innerHTML = sele + this[0].innerHTML;
            } else {
                $(sele).insertBefore(this);
            }
            return this;
        },
        replaceAll: function (sele) {
            //统一的将传进来的元素转化为JQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            $target.each(function (key, value) {
                var parent = value.parentNode;
                $this.each(function (k, v) {
                    if (key == 0) {
                        $(v).insertBefore(value);
                        $(value).remove();
                        res.push(v);
                    } else {
                        var cloneSourceEle = v.cloneNode(true);
                        $(cloneSourceEle).insertBefore(value);
                        $(value).remove();
                        res.push(cloneSourceEle);
                    }
                })
            })
            return $(res);
        },
        clone: function (deep) {
            var res = [];
            if (deep) {
                this.each(function (key, ele) {
                    var temp = ele.cloneNode(true);
                    lmjQuery.each(ele.eventsCache, function (name, array) {
                        array.each(function (index, method) {
                            $(temp).on(name, method);
                        })
                    })
                    res.push(temp);
                })
                return $(res);
            } else {
                this.each(function (key, ele) {
                    var temp = ele.cloneNode(true);
                    res.push(temp);
                })
                return $(res);
            }
        }
    })
    // 属性相关操作方法
    lmjQuery.prototype.extend({
        attr: function (attr, value) {
            if (lmjQuery.isString(attr)) {
                if (arguments.length === 1) {
                    return this[0].getAttribute(attr);
                } else {
                    this.each(function (key, ele) {
                        ele.setAttribute(attr, value);
                    })
                }
            } else if (lmjQuery.isObject(attr)) {
                var $this = this;
                $.each(attr, function (key, value) {
                    $this.each(function (k, ele) {
                        ele.setAttribute(key, value);
                    })
                })
            }
            return this;
        },
        // 有bug
        prop: function (attr, value) {
            if (lmjQuery.isString(attr)) {
                if (arguments.length === 1) {
                    return this[0][attr];
                } else {
                    this.each(function (key, ele) {
                        // setAttribute主要用来操作属性操作属性节点则需要[]
                        ele[attr] = value;
                    })
                }
            } else if (lmjQuery.isObject(attr)) {
                var $this = this;
                $.each(attr, function (key, value) {
                    $this.each(function (k, ele) {
                        ele[key] = value;
                    })
                })
            }
            return this;
        },
        css: function (attr, value) {
            if (lmjQuery.isString(attr)) {
                if (arguments.length === 1) {
                    return lmjQuery.getStyle(this[0], attr);
                } else {
                    this.each(function (key, ele) {
                        // setAttribute主要用来操作属性操作属性节点则需要[]
                        ele.style.attr = value;
                    })
                }
            } else if (lmjQuery.isObject(attr)) {
                var $this = this;
                $.each(attr, function (key, value) {
                    $this.each(function (k, ele) {
                        ele.style.key = value;
                    })
                })
            }
            return this;
        },
        val: function (content) {
            if (arguments.length === 0) {
                return this[0].value;
            } else {
                this.each(function (key, ele) {
                    ele.value = content;
                });
                return this;
            }
        },
        hasClass: function (name) {
            var flag = false;
            if (arguments.length === 0) {
                return flag;
            } else {
                this.each(function (k, v) {
                    var className = ' ' + v.className + ' '
                    name = ' ' + name + ' ';
                    if (className.indexOf(name) !== -1) {
                        flag = true;
                        //跳出循环返回flag=true;
                        return false;
                    }
                })
                return flag;
            }
        },
        addClass: function (name) {
            if (arguments.length === 0) return this;
            // 1.对传入的类名进行切割
            var names = name.split(" ");
            // 2.遍历取出所有的元素
            this.each(function (key, ele) {
                // 3.遍历数组取出每一个类名
                $.each(names, function (k, value) {
                    // 4.判断指定元素中是否包含指定的类名
                    if (!$(ele).hasClass(value)) {
                        ele.className = ele.className + " " + value;
                    }
                });
            });
            return this;
        },
        removeClass: function (name) {
            if (arguments.length === 0) {
                //不传参的情况下让所有调用的元素的类名为空
                this.each(function (key, ele) {
                    ele.className = '';
                })
            } else {
                // 1.对传入的类名进行切割
                var names = name.split(" ");
                // 2.遍历取出所有的元素
                this.each(function (key, ele) {
                    // 3.遍历数组取出每一个类名
                    $.each(names, function (k, value) {
                        // 4.判断指定元素中是否包含指定的类名
                        if ($(ele).hasClass(value)) {
                            ele.className = ' ' + ele.className + ' ';
                            //注意替换完还要赋值
                            ele.className = ele.className.replace(' ' + value + ' ', '');
                        }
                    });
                });
            }
            return this;
        },
        toggleClass: function (name) {
            if (arguments.length === 0) {
                this.removeClass();
            } else {
                // 1.对传入的类名进行切割
                var names = name.split(" ");
                // 2.遍历取出所有的元素
                this.each(function (key, ele) {
                    // 3.遍历数组取出每一个类名
                    $.each(names, function (k, value) {
                        // 4.判断指定元素中是否包含指定的类名
                        if ($(ele).hasClass(value)) {
                            $(ele).removeClass(value);
                        } else {
                            $(ele).addClass(value);
                        }
                    });
                });
            }

            return this;
        }
    })
    // 事件相关的方法
    lmjQuery.prototype.extend({
        on: function (name, callBack) {
            this.each(function (key, ele) {
                if (!ele.eventsCache) {
                    ele.eventsCache = {};
                }
                if (!ele.eventsCache[name]) {
                    ele.eventsCache[name] = [];
                    ele.eventsCache[name].push(callBack);
                    lmjQuery.addEvent(ele, name, function () {
                        lmjQuery.each(ele.eventsCache[name], function (k, method) {
                            method();
                        })
                    });
                }
                else {
                    ele.eventsCache[name].push(callBack);
                }

            })
        },
        off: function (name, callBack) {
            if (arguments.length === 0) {
                this.each(function (key, ele) {
                    ele.eventsCache = {};
                })
            } else if (arguments.length === 1) {
                this.each(function (key, ele) {
                    ele.eventsCache[name] = [];
                })
            } else if (arguments.length === 2) {
                this.each(function (key, ele) {
                    lmjQuery.each(ele.eventsCache[name], function (index, method) {
                        if (method === callBack) {
                            ele.eventsCache[name].splice(index, 1);
                        }
                    })
                })
            }
        }
    })





    // 让init的原型对象指向lmjQuery的对象
    lmjQuery.prototype.init.prototype = lmjQuery.prototype;
    // 让其变为全局变量
    window.lmjQuery = window.$ = lmjQuery;
})(window)