$(function () {
    var form = layui.form
    var laypage = layui.laypage

    // 时间美化函数
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var h = padZero(dt.getHours())
        var f = padZero(dt.getMinutes())
        var s = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + h + ':' + f + ":" + s
    }
    function padZero(n) {
        if (n < 10) {
            return '0' + n
        } else {
            return n
        }
    }

    var layer = layui.layer
    // 定义一个需要查询的参数对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,        //页码值，默认请求第一页的数据
        pagesize: 2,       //每页显示多少数据，默认每页显示两条
        cate_id: "",       //文章分类的id，默认为空
        state: "",       //文章的发布状态
    }
    initTable()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                // 使用模板引擎渲染页面的数据
                var htmlstr = template('tpl-table', res)
                $('tbody').html(htmlstr)
                renderPage(res.total)
            }
        })
    }


    initCate()
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                // 模板引擎
                var htmlstr = template('tpl-Cate', res)
                $('#cate_id').html(htmlstr)
                // 模板引擎成功调用了还是出不来
                // 如果发生了这样的错误就调用下面的这个试试
                // 渲染完之后通知layui，重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 筛选功能的实现
    $('#form_search').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 获取到表单中当前选中的项
        var cate_id = $('#cate_id').val()
        var state = $('#state').val()
        // 把q里对应的项改了
        q.cate_id = cate_id
        q.state = state
        // 根据改了的q重新获取文章列表
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',    //分页容器的ID(注意不要加#号)
            count: total,       //总条数
            limit: q.pagesize,  //每页显示的条数
            curr: q.pagenum,    //默认选中的页码
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 4, 5, 10],
            // 触发jump回调的方法有两种
            // 1.点击页码值会调用
            // 2.调用了laypage.render(),就会触发jump
            jump: function (obj, first) {
                // 这里first有两个值
                // 如果是点击页码触发的，first就是undefined
                // 如果是调用方法触发的，first就是true
                console.log(first);
                console.log(obj.curr);
                // 把当前点击的页码值赋值给q里的pagenum
                q.pagenum = obj.curr
                // 把当前选中的最新的条目数赋值给q里的pagesize
                q.pagesize = obj.limit
                // 这里不能直接调用initTable()方法，会发生死循环
                // 原因是这里调了initTable，在initTable里有renderPage方法
                // 就会又回到这里继续调用initTable，构成死循环
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过代理的方式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取页面上剩余的删除按钮的个数
        var len = $('.btn-delete').length
        console.log(len);
        var id = $(this).attr('data-id')
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    // 如果len的值等于1，就代表着当前页面只有一个删除按钮
                    // 在点击删除之后就没了，所以页码要减一
                    if (len === 1) {
                        // 页码最小只能是1，所以还得加一步判断
                        if (q.pagenum === 1) {
                            q.pagenum = 1
                        } else {
                            q.pagenum = q.pagenum - 1
                        }
                    }
                    initTable()
                }
            })
            layer.close(index);
        });

    })
})