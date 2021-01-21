$(function () {
    alert(location.search.split('=')[1])
    function initForm() {
        var id = location.search.split('=')[1]
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染到form表单中
                form.val('form-edit', res.data)
                tinyMCE.activeEditor.setContent(res.data.content)
                if(!res.data.cover_img){
                    return layer.msg('用户未上传头像')
                }
                var newImgURL = baseURL + res.data.cover_img
                $image
                    .cropper('destroy')
                    .attr('src', newImgURL)
                    .cropper(options)
            }
        })
    }




    var layer = layui.layer
    var form = layui.form

    initCate()
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                var htmlstr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlstr)
                // 不写下面这行，出不来，也不会报错
                form.render()
                // 文章渲染完毕再调用，初始化form的方法
                initForm()
            }
        })
    }

    // 初始化富文本编辑器
    // 在导入了那两个富文本编辑器的脚本之后，再引入这个方法就可以产生
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 给选择封面按钮绑定点击事件
    // 点击的时候触发file按钮
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    // 监听coverFile的change事件,获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        // 根据文件,创建对应的URL地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 为表单绑定submit提交事件
    $('#form_pub').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 基于form表单快速创建一个FormData对象
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)
        // 将封面裁剪后的图片输出为一个文件对象
        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            // 将 Canvas 画布上的内容，转化为文件对象
            .toBlob(function (blob) {
                // 得到文件对象后，进行后续的操作
                // 将文件对象存储到fd中
                fd.append('cover_img', blob)
                console.log(...fd);
                // 发表文章
                publishArticle(fd)
            })
    })
    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 注意:如果向服务器提交的是formdata格式的数据
            // 则必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('失败')
                }
                layer.msg('修改成功')
                // 用location的话,会跳转.但是文章列表按钮不会被点击变色
                // location.href = '/aiticle/art_list.html'
                // 所以直接给那个按钮添加点击事件
                window.parent.document.getElementById('art_list').click()
            }
        })
    }
})