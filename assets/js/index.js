$(function () {
    //获取用户基本信息
    getUserInfo()
    var layer = layui.layer
    //点击按钮，实现退出
    $('#btnLogout').on('click', function () {
        // 弹窗
        // 复制layui网站的
        layer.confirm('是否退出登录？', { icon: 3, title: '提示' }, function (index) {
            // 清空token
            localStorage.removeItem('token')
            // 页面跳转
            location.href='/login.html'
            // 关闭询问框
            layer.close(index);
        });
    })
})
// 刻意写在入口函数外面，因为未来还有别的页面要调用
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // 设置请求头，用的是headers
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            renderAvatar(res.data)
        }
    });
}
// 渲染头像
function renderAvatar(user) {
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        var first = name[0].toUpperCase()
        $('.layui-nav-img').hide()
        $('.text-avatar').show().html(first)
    }
}