<template>
    <div>
        <h1>Hello {{msg}}!</h1>
        <a href="">link</a>
    </div>
</template>
<style lang="scss">
    $color: #fff;
    h1{
        color: $color;
    }
    body{
        background: pink;
    }
    p{
        color: $color;
    }

</style>
<script>
export default{
    data(){
        return{
            msg : 'Test'
        }
    }
}
</script>
