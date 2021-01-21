$(function () {
    var layer = layui.layer
    var form = layui.form
    // 获取文章分类列表
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlstr = template('tpl-table', res)
                $('tbody').html(htmlstr)
            }
        })
    }
    var index
    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        // 下面是layui里的方法open，在layui网站的弹出层里，里面的参数在里面都能找到
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的形式为form-add添加submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList()
                layer.close(layer.index)
                layer.msg(res.message)
            }
        })
    })


    var indexEdit
    // 通过代理的方式为btn-edit添加点击事件
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var Id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    // 点击修改发送ajax
    $('body').on('submit', '#form-edit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                initArtCateList()
                layer.close(indexEdit)
                layer.msg('更新分类数据成功')
            }
        })
    })

    // 通过代理的方式为每一个删除添加点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确定要删除吗？', { icon: 3, title: '提示' }, function (index) {
            // ajax
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败，可能已经被删除')
                    }
                    initArtCateList()
                    layer.close(index);
                }
            })

        });
    })
})