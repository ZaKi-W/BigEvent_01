$(function(){
    var form = layui.form
    var layer = layui.layer
    // 自定义密码校验规则
    form.verify({
        pwd:[/^[\S]{6,12}$/ , '密码必须在6-12位且不能有空格'],
        samePwd:function(value){
            if(value === $('[name=oldPwd]').val()){
                return '新旧密码不能相同'
            }
        },
        rePwd:function(value){
            if(value !== $('[name=newPwd]').val()){
                return '两次密码输入不一致'
            }
        }
    })
    // 发起ajax请求，修改密码
    $('.layui-form').on('submit', function(e){
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发送ajax请求
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            // 快速获取整个表单的信息
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                // 修改成功后提示修改成功
                layer.msg('修改成功')
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})