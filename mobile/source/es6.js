
// var  Hello = require('../../vueCompont/hello.vue');
import Hello from '../../vueCompont/hello.vue';

const data  = (()=>{
    return {
        msg : 'This is vue'
    }
})();

new Vue({
    el : '#app',
    data : data,
    components: {
        'my-component': Hello
    }
})
