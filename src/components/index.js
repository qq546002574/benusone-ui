// 插件对应组件的名字
import bsCarousel from './carousel';
import bsCarouselItem from './carouselItem';
import bsCascader from './cascader';
import bsBaseForm from './baseForm';
import bsBaseCollapse from './baseCollapse';
import bsBaseQrcode from './baseQrcode';
import bsCodeEdit from './codeEdit';
// Vue.js 的插件应当有一个公开方法 install 。第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象
// 参考：https://cn.vuejs.org/v2/guide/plugins.html#%E5%BC%80%E5%8F%91%E6%8F%92%E4%BB%B6
// 此处注意，组件需要添加name属性，代表注册的组件名称，也可以修改成其他的
const components = {
    install(Vue) {
        Vue.component('bsCarousel', bsCarousel);
        Vue.component('bsCarouselItem', bsCarouselItem);
        Vue.component('bsCascader', bsCascader);
        Vue.component('bsBaseForm', bsBaseForm);
        Vue.component('bsBaseCollapse', bsBaseCollapse);
        Vue.component('bsBaseQrcode', bsBaseQrcode);
        Vue.component('bsCodeEdit', bsCodeEdit);
    }
}
// CarouselItem.install = Vue => Vue.component(CarouselItem.name, CarouselItem);//注册组件

// 标签的方式引入，留到后面再另开新篇讨论
//const install = function(Vue, opts = {}) {
//　　Vue.component(CarouselItem.name, CarouselItem);
//}

/* 支持使用标签的方式引入 Vue是全局变量时，自动install */
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(components);
}

export default components;