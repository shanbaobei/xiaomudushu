点击button按钮触发click事件：handleLogin

methods:下有handleLogin

elementui的表单验证

this.$store.dispatch调用了vuex下的login方法

vuex中的login又调用了api/user.js下封装的login

又调用了utils/request.js工具类 ，其实是axios

调用了后端登录接口，拿到登录结果

把token放到state.token
