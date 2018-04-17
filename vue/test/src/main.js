import Vue from "vue";
import ElementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
import Test from "./components/test";

Vue.use(ElementUI);

new Vue({
	el: "#app",
	render: h => h(Test)
});
