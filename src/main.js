import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import VueDND from 'awe-dnd'
import './styles.scss'
import Bmob from "hydrogen-js-sdk";
import Cookies from 'js-cookie'
import 'gitalk/dist/gitalk.css'
import "babel-polyfill";

Bmob.initialize("4c0ae9b3a1fbc439", "123456");
Vue.prototype.Bmob = Bmob
Vue.prototype.Cookies = Cookies

Vue.use(ElementUI)


Vue.use(VueDND)
Vue.config.productionTip = false


Vue.directive('title', {
    inserted: function(el) {
        document.title = el.dataset.title
    }
})

new Vue({
    render: h => h(App),
}).$mount('#app')