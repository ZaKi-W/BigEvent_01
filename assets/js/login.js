$(function () {
    $('#link_reg').on('click', function () {
        $('.login_box').hide()
        $('.reg_box').show()
        // $('.login_box [name=username]').val('')
        // $('.login_box [name=password]').val('')
    })
    $('#link_login').on('click', function () {
        $('.login_box').show()
        $('.reg_box').hide()
        // $('.reg_box [name=username]').val('')
        // $('.reg_box [name=password]').val('')
        // $('.reg_box [name=repassword]').val('')
    })

    // 自定义校验规则
    // 引入了layui.js之后，layui这个属性就可以用了
    var form = layui.form
    var layer = layui.layer
    // 下面的语法是在layui的网站里有的
    form.verify({
        pwd: [
            // 数组中第一个元素是正则表达式
            /^[\S]{6,16}$/,
            // 第二个是报错提示
            '密码必须是6-16位，且不能有空格'
        ],
        repwd: function (value) {
            var pwd = $('.reg_box [name=password]').val()
            if (pwd !== value) {
                $('.reg_box [name=repassword]').val('')
                return '两次密码输入不一致'
            }
        }
    })
    // 注册
    // 表单提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止表单的默认提交
        e.preventDefault()
        // 发送ajax请求
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg_box [name=username]').val(),
                password: $('.reg_box [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功')
                $('#link_login').click()
                // 把注册表单重置
                $("#form_reg")[0].reset()
            }
        })
    })

    // 登录
    // 表单提交事件
    $('#form_login').on('submit', function(e){
        // 阻止表单的默认提交事件
        e.preventDefault()
        // 发送ajax请求
        $.ajax({
            method:'POST',
            url:'/api/login',
            // 快速获取
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                // 提示
                layer.msg('登录成功')
                // 跳转
                location.href = '/index.html'
                // 保存token到本地，未来要用
                localStorage.setItem('token',res.token)
            }
        })
    })
})