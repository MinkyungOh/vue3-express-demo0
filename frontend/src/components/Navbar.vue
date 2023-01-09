<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">MyProject</a>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <router-link v-for="menu in menuList" :key="menu.no"
            class="nav-link" aria-current="page" :to="menu.path"
            :class="selectedMenu===menu.no? 'active':''"
            @click="onClickMenu(menu.no)"
          >{{menu.name}}</router-link>
        </div>
      </div>
      <span class="navbar-text">
        <router-link to="/login">signin</router-link> | 
        <router-link to="/signup">signup</router-link>
      </span>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      selectedMenu: 0
    }
  },
  methods: {
    onClickMenu(menu) {
      this.selectedMenu = menu;
    }
  },
  created() {
    this.menuList = [
      {
        no: 0,
        path: '/',
        name: 'Home'
      },
      {
        no: 1,
        path: '/about',
        name: 'About'
      },
      {
        no: 2,
        path: '',
        name: '과제'
      },
      {
        no: 3,
        path: '',
        name: '자유게시판'
      },
    ];
  }
}
</script>

<style>

</style>