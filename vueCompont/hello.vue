<template>
    <h1>Hello {{msg}}!</h1>
</template>
<script>
export default{
    data(){
        return{
            msg : 'Vue.js'
        }
    }
}
</script>
<style lang="scss">
    $color: '#f00'
    h1{
        color: $color;
    }
</style>
