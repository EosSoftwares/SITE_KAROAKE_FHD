<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot="links-after">
        <b-nav class="navbar-nav mb-md-3">
          <b-nav-item to="/admin/dashboard">
            <i class="ni ni-spaceship"></i>
            <b-nav-text class="p-0">Home</b-nav-text>
          </b-nav-item>
          <b-nav-item to="/admin/produtos">
            <i class="ni ni ni-laptop"></i>
            <b-nav-text class="p-0">Produtos</b-nav-text>
          </b-nav-item>
          <b-nav-item to="/admin/pacotes">
            <i class="ni ni-headphones"></i>
            <b-nav-text class="p-0">Pacotes</b-nav-text>
          </b-nav-item>
          <b-nav-item to="/admin/creditos">
            <i class="ni ni-money-coins"></i>
            <b-nav-text class="p-0">Créditos</b-nav-text>
          </b-nav-item>
          <b-nav-item to="/admin/musicas">
            <i class="ni ni ni-note-03"></i>
            <b-nav-text class="p-0">Músicas</b-nav-text>
          </b-nav-item>
        </b-nav>
      </template>
    </side-bar>
    <div class="main-content">
      <dashboard-navbar :type="$route.meta.navbarType"></dashboard-navbar>

      <div @click="$sidebar.displaySidebar(false)">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </fade-transition>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>

    <!-- <base-button @click="() => {$router.push('/admin/pedido/carrinho')}" round class="position-fixed btn-success btn-icon-only to-right">
      <span class="btn-inner--icon"><i class="ni ni-basket"></i></span>
    </base-button> -->
  </div>
</template>
<script>
  /* eslint-disable no-new */
  import PerfectScrollbar from 'perfect-scrollbar';
  import 'perfect-scrollbar/css/perfect-scrollbar.css';

  function hasElement(className) {
    return document.getElementsByClassName(className).length > 0;
  }

  function initScrollbar(className) {
    if (hasElement(className)) {
      new PerfectScrollbar(`.${className}`);
    } else {
      // try to init it later in case this component is loaded async
      setTimeout(() => {
        initScrollbar(className);
      }, 100);
    }
  }

  import DashboardNavbar from './DashboardNavbar.vue';
  import ContentFooter from './ContentFooter.vue';
  import { FadeTransition } from 'vue2-transitions';

  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      FadeTransition
    },
    methods: {
      initScrollbar() {
        let isWindows = navigator.platform.startsWith('Win');
        if (isWindows) {
          initScrollbar('sidenav');
        }
      }
    },
    mounted() {
      this.initScrollbar()
    }
  };
</script>
<style lang="scss">
.to-right {
  right: 10px;
  bottom: 10px;
  z-index: 10;
  background: rgb(38, 155, 14);
  font-size: 1.3rem;
  border: currentColor;
  width: 3rem;
  height: 3rem;
}
</style>
