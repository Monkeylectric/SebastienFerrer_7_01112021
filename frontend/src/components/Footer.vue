<template>
    <div id="footer">
        <footer>
            <p>© Groupomania 2021</p>
        </footer>
    </div>
</template>

<script>
export default {
    name: "Footer",
    props: [], 
    data() {
        return {
            
        }
    },
    methods : {
        
    },
    mounted() {
        
    }
}
</script>

<style scoped lang="scss">
    #footer {
        display: flex;
        align-items: center;
        justify-content: center;
        width:100%;
        height:4vh;
        background:rgb(121, 121, 121);
        color: #FFF;
        //position:sticky;
        bottom:0;

        p {
            height: 100%;
            margin: 0 auto;
        }
    }
</style>