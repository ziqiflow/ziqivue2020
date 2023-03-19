<template>
<div>
</div>
</template>

<script>


//这个是承接页面，如果openid不存在的话，就要用这个页面去调用获取openid；
export default {

    mounted() {
        //先与服务器通讯，获取用户的token ::如果存在，那么就获取token过来，然后跳转回去之前的页面。
        //如果不存在，那么获取跳转页面的地方：页面跳转到微信，然后微信在跳转回来，这个时候

        //console.log(window.location.href);
        //加入一个
        //return;
        //console.log(this.$route.currentRoute.fullPath);
        console.log(window.location.href);

        api.GetToken({
            href: window.location.href
        }).then(({
            data
        }) => {
            if (!data.success) {
                Toast(data.msg);
                return;
            }

            //如果页面跳转
            if (!!data.data.tourl) {
                //localStorage.setItem('_token',data.data._token);//此访问需要加控制；
                window.location.href = data.data.tourl; //实现页面重定向:这里主要是微信认证跳转；
                return;
            }
            //if(!!data.data._token){
            //跳转到其他页面
            try {
                localStorage.setItem('_token', data.data._token);
                localStorage.setItem('_tokencreatat', Number(new Date().getTime()));

                console.log(this.$route.query.redirect);
                let redirectUrl = decodeURIComponent(this.$route.query.redirect || '/');
                console.log(redirectUrl);
                //跳转到指定的路由
                this.$router.replace({
                    path: redirectUrl
                });
            } catch (error) {
                this.$router.replace({
                    path: '/'
                });

            }
            //}
            //return;
        })


    },

}
</script>

<style scoped>

</style>
