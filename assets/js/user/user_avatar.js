$(function () {
    var layer = layui.layer

// //////////////////////////////
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
// //////////////////////////////

    // 给上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function(){
        $('#file').click()
    })

    // 修改裁剪区域的图片
    $('#file').on('change', function(e){
        // 获取选择的图片文件
        var file = e.target.files[0]
        // 把file在内存中生成一个地址
        var newImgUrl = URL.createObjectURL(file)
        // 重新渲染裁剪区域
        $image
            .cropper('destroy')     //销毁裁剪区域旧的
            .attr('src',newImgUrl)  //设置新的
            .cropper(options)       //重新渲染  
    })

    // 更换头像
    $('#btnUpload').on('click', function(){
        var dataURL = $image
            .cropper('getCroppedCanvas',{
                width:100,
                hight:100
            })
            .toDataURL('image/png')
        console.log(dataURL);
        console.log(typeof dataURL);
        // 发送ajax
        $.ajax({
            method:'POST',
            url:'/my/update/avatar',
            data:{
                avatar:dataURL
            },
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg('更换头像成功')
                window.parent.getUserInfo()
            }
        })
    })
})