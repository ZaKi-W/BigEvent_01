$(function () {
    var layer = layui.layer
    var form = layui.form
    // 自定义验证规则
    // layui里带的属性，必须引入layui才行
    form.verify({
        nickname: function (value) {
            if (value.length > 6){
                return '昵称长度在1-6个字符内'
            }
        }
    })

    // 获取用户信息并渲染到页面中
    initUserInfo()
    function initUserInfo(){
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                //调用form.val快速为表单赋值
                // 括号外是写死的，括号里第一个是给谁赋，第二个是值
                // 第一个是在html里form那里定义的lay-filter的值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置功能
    $('#btnReset').on('click', function(e){
        // 阻止重置
        e.preventDefault()
        // 从新用户渲染
        initUserInfo()
    })

    //修改用户信息
    $('.layui-form').on('submit', function(e){
        // 阻止表单的默认提交
        e.preventDefault()
        // ajax
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$('.layui-form').serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(reg.message)
                }
                layer.msg('修改成功')
                window.parent.getUserInfo()
            }
        })
    })

})