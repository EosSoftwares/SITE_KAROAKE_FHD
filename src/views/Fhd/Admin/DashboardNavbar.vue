<template>
  <base-nav
    container-classes="container-fluid"
    class="navbar-top border-bottom navbar-expand"
    :class="{'bg-info navbar-dark': type === 'default'}"
  >
    <!-- Navbar links -->
    <b-navbar-nav class=" align-items-center ml-md-auto">
      <!-- This item dont have <b-nav-item> because they add class 'nav-link' which is not needed here -->
      <li class="nav-item d-xl-none">
        <!-- Sidenav toggler -->
        <div class="pr-3 sidenav-toggler"
             :class="{active: $sidebar.showSidebar, 'sidenav-toggler-dark': type === 'default', 'sidenav-toggler-light': type === 'light'}"
             @click="toggleSidebar">
          <div class="sidenav-toggler-inner">
            <i class="sidenav-toggler-line"></i>
            <i class="sidenav-toggler-line"></i>
            <i class="sidenav-toggler-line"></i>
          </div>
        </div>
      </li>

    </b-navbar-nav>
    <b-navbar-nav class="align-items-center ml-auto ml-md-0">
      <base-dropdown menu-on-right
                     class="nav-item"
                     tag="li"
                     title-tag="a"
                     title-classes="nav-link pr-0">
        <a href="#" class="nav-link pr-0" @click.prevent slot="title-container">
          <b-media no-body class="align-items-center">
                  <span class="avatar avatar-sm rounded-circle">
                    <div class="icon-avatar">{{login.user.firstName[0]}} {{login.user.lastName[0]}}</div>
                  </span>
            <b-media-body class="ml-2 d-none d-lg-block">
              <span class="mb-0 text-sm  font-weight-bold">{{login.user.firstName}} {{login.user.lastName}}</span>
            </b-media-body>
          </b-media>
        </a>

        <template>
          <b-dropdown-item to="/admin/user/profile">
            <i class="ni ni-single-02"></i>
            <span>Perfil</span>
          </b-dropdown-item>
          <div class="dropdown-divider"></div>
          <b-dropdown-item @click="logout">
            <i class="ni ni-user-run"></i>
            <span>Sair</span>
          </b-dropdown-item>

        </template>
      </base-dropdown>
    </b-navbar-nav>
  </base-nav>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
import { BaseNav } from '@/components';
export default {
  components: {
    BaseNav
  },
  props: {
    type: {
      type: String,
      default: 'default', // default|light
      description: 'Look of the dashboard navbar. Default (Green) or light (gray)'
    }
  },
  computed: {
    ...mapGetters('login', ['login']),
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    }
  },
  data() {
    return {
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      searchQuery: ''
    };
  },
  methods: {
    ...mapActions('login', ['logout']),
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
  }
};
</script>
<style scoped>
.icon-avatar {
  width: 36px;
  height: 36px;
  background: rgb(0, 187, 255);
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 18px;
  text-transform: uppercase;
}
</style>