<template>
    <h1>Hello {{msg}}!</h1>
</template>
<style  lang="scss">
    $color: #fff;
    h1{
        color: $color;
    }
    body{
        background: blue;
    }
    p{
        color: $color;
    }
    div{
        color: $color;
        display: flex;
        justify-content: center;
    }
</style>
<script>
export default{
    data(){
        return{
            msg : 'Vue'
        }
    }
}
</script>
