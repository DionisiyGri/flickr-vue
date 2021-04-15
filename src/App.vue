<template>
  <div id="app">
    <HelloWorld msg="Hello Flickr!" />
    <Flickr></Flickr>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Flickr from "./components/Flickr.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
    Flickr,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
