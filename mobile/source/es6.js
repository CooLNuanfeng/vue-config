
// var  Hello = require('../../vueCompont/hello.vue');
import Hello from '../../vueCompont/hello.vue';

alert('d')
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
