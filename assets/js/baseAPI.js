// 在发送 ajax() get() post()之前会触发
$.ajaxPrefilter(function(options){
    // alert(options.url)
    // 添加路径前缀
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    // alert(options.url)

    // 给有权限的路径添加头信息
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization:localStorage.getItem('token') || ''
        }
    }
    options.complete = function(res){
        // console.log(res.responseJSON);
        var obj = res.responseJSON
        if(obj.status === 1 && obj.message === '身份认证失败！'){
            // 清空本地token
            localStorage.removeItem('token')
            // 页面跳转
            location.href = '/login.html'
        }
    }
})