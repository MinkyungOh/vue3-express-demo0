<template>
  <div>
    <Navbar msg="Welcome to Your Vue.js App"/>
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  components: {
    Navbar
  }
}
</script>

<style>

</style>
