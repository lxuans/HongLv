$(function () {

    // 需求: 在点击菜单的时候 , 主页网友移动 ,左侧菜单也往右移动
    // 1 . 获取点击菜单中需要用到的元素

    var icon_menu = $('.icon-menu');
    var layout = $('.layout');
    var mask = $('.mask');
    var left_menu = $('#left_menu');

    // console.log(layout);

    // 2 . 添加点击事件
    icon_menu.click(function () {

        // 3 . 把主页往右移动200px , 同时遮罩层显示
        layout.css({
            transform: 'translateX(200px)'
        });
        mask.addClass('show');

        // 4. 左侧菜单栏也往右移动200px  (-200+200=0)
        left_menu.css({
            transform: 'translateX(0)'
        });

        // 点击之后下拉滚动条消失
        $('body').css('overflow-y', 'hidden');

    })

    // 5 . 点击遮罩层的任意位置 左侧菜单栏往左移动200px , 主页也往左移动200px , 遮罩层隐藏
    mask.click(function () {
        mask.removeClass('show');
        layout.css({
            transform: 'translateX(0)'
        });
        left_menu.css({
            transform: 'translateX(-200px)'
        });

        // 下拉滚动条恢复
        $('body').css('overflow-y', 'auto');
    })


    // 1 . 请求轮播图API
    // 2 . 将请求到的轮播图数据 给模板去生成html
    // 3 . 把生成好的html 放到 轮播图每一项的容器里面
    getSlide();

    function getSlide() {
        // 用ajax 发送请求
        $.ajax({
            // 参数1 :请求地址
            url: "http://139.199.192.48:9091/api/getlunbo",
            // 参数2 : 请求成功后执行的回调函数
            success: function (data) {
                // 因为请求回来的是一个数组 , 需要包到一个对象的list属性身上,遍历属性的时候,因为属性值又是一个对象而且里面不止一个键, 所以在模板中要用对象.键的方式获取键值,渲染到页面中
                data = {
                    'list': data
                };
                // 给模板生成html,第一个参数是模板的ID,第二个参数是请求回来的数据
                var tpl = template('temp', data);
                // console.log(tpl);
                
                // 添加到页面容器中
                $('.carousel-inner').html(tpl);
                // 注意 : 如果直接替换里面的每一项轮播 可能会出现轮播图看不见的情况 , 但实际上又能log出结构,这是因为轮播项需要一个active才能显示
                $('.carousel-inner .item').eq(0).addClass('active');
            }
        })
    }


    // 手动轮播图
    // 1 . 获取需要绑定事件的元素
    var slide = $('#slide');
    // 2 . 声明滑动时的起点和终点
    var startX, endX;
    // 3 . 绑定滑动开始时的事件
    slide.on("touchstart", function (e) {
        // console.log(e);
        //  3.1 获取当前触摸到屏幕时的横坐标
        startX = e.originalEvent.touches[0].clientX;
        console.log(startX);

    });
    //  4 . 绑定滑动结束事件
    slide.on("touchend", function (e) {
        //  4.1 获取滑动结束手指离开时的横坐标
        endX = e.originalEvent.changedTouches[0].clientX;
        console.log(endX);
        //  5 . 判断滑动方向
        // 如果滑动距离是正值 , 说明是从左往右滑动 , 图片应该切换到上一张
        // 如果滑动距离是负值 , 说明是从右往左滑动 , 图片应该切换到下一张
        if (endX - startX > 0) {
            slide.carousel('prev');
        } else {
            slide.carousel('next');
        }

    })


    // 异步请求tab动漫数据
    $('.nav-tabs>li>a').on('click', function () {
        console.log($(this).data('type'));
        console.log($(this).attr('href'));
        getCartoonList($(this).data('type'),$(this).attr('href'));
    });
    getCartoonList(1,'#hl_home')
    function getCartoonList(type,href) {
        $.ajax({
            url: "http://139.199.192.48:9091/api/gethometab/" + type,
            success: function (data) {
                // console.log(data);
                var cartoonListTmp = template('cartoonListTmp',{"list":data});
                // console.log(cartoonListTmp);
                $(href).html(cartoonListTmp)
            }
        })
    }


})