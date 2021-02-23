<template>
    <div id="app">
        <h2>calculate</h2>
        <bs-carousel v-model="checkIndex">
            <bs-carousel-item name="1">
                <img src="./assets/logo.png"/>
            </bs-carousel-item>
            <bs-carousel-item name="2">
                <img src="./assets/logo.png"/>
            </bs-carousel-item>
        </bs-carousel>
    </div>
</template>

<script>
    import bsCarousel from './components/carousel'; // 引入
    import bsCarouselItem from './components/carouselItem'; // 引入
    export default {
        components: { //注册插件
            bsCarousel,
            bsCarouselItem
        },
        name: 'app',
        data() {
            return {
                checkIndex: 1,
            }
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
