
// var  Hello = require('../../vueCompont/hello.vue');
import Hello from '../../vueCompont/hello.vue';
import data from './data.js';

// const data  = (()=>{
//     return {
//         msg : 'This is vue'
//     }
// })();

new Vue({
    el : '#app',
    data : data,
    components: {
        'my-component': Hello
    }
})
