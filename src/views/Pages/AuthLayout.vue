<template>
  <div>
    <base-nav
      v-model="showMenu"
      type="light"
      :transparent="true"
      menu-classes="justify-content-end"
      class="navbar-horizontal navbar-main"
      expand="lg"
    >
      <div slot="brand" class="navbar-wrapper">
        <b-navbar-brand to="/">
          <img src="/img/brand/logo-fhd.jpeg">
        </b-navbar-brand>
      </div>

     <template>
       <div class="navbar-collapse-header">
         <b-row>
           <b-col cols="6" class="collapse-brand">
             <router-link to="/">
               <img src="/img/brand/logo-fhd.jpeg">
             </router-link>
           </b-col>
           <b-col cols="6" class="collapse-close">
             <button type="button" class="navbar-toggler" @click="showMenu = false">
               <span></span>
               <span></span>
             </button>
           </b-col>
         </b-row>
       </div>

       <hr class="d-lg-none">
       <b-navbar-nav  class="align-items-lg-center ml-lg-auto">
         <b-nav-item link-classes="nav-link-icon" href="#" target="_blank"
              data-toggle="tooltip" data-original-title="Like us on Facebook" >
             <i class="fab fa-facebook-square"></i>
             <span class="nav-link-inner--text d-lg-none">Facebook</span>
         </b-nav-item>
         <b-nav-item link-classes="nav-link-icon" href="#" target="_blank" data-toggle="tooltip" data-original-title="Follow us on Instagram">
             <i class="fab fa-instagram"></i>
             <span class="nav-link-inner--text d-lg-none">Instagram</span>
         </b-nav-item>
         <b-nav-item link-classes="nav-link-icon" href="#" target="_blank" data-toggle="tooltip" data-original-title="Follow us on Twitter">
             <i class="fab fa-twitter-square"></i>
             <span class="nav-link-inner--text d-lg-none">Twitter</span>
         </b-nav-item>
         <b-nav-item class="ml-4" link-classes="nav-link-icon" href="/login"
              data-toggle="tooltip" data-original-title="Acesse nossa plataforma" >
             Acessar
             <span class="nav-link-inner--text d-lg-none">Facebook</span>
         </b-nav-item>
         <!-- This item dont have <b-nav-item> because they add class 'nav-link' which is not needed here -->
       </b-navbar-nav>
     </template>
    </base-nav>

    <div class="main-content">
      <zoom-center-transition
        :duration="pageTransitionDuration"
        mode="out-in"
      >
        <router-view></router-view>
      </zoom-center-transition>
    </div>

    <footer class="py-5" id="footer-main">
      <b-container >
        <b-row align-v="center" class="justify-content-xl-between">
          <b-col xl="6">
            <div class="copyright text-center text-xl-left text-muted">
              © {{year}} <a href="#" class="font-weight-bold ml-1" target="_blank">Karaokê FHD</a>
            </div>
          </b-col>
          <b-col xl="6" class="col-xl-6">
            <b-nav  class="nav-footer justify-content-center justify-content-xl-end">
              <b-nav-item href="#" target="_blank" >
                Sobre
              </b-nav-item>
              <b-nav-item href="/politicas-de-privacidade" target="_blank">
                Politícas de privacidade
              </b-nav-item>
              <b-nav-item href="/politicas-de-privacidade" target="_blank">
                Licenças
              </b-nav-item>
            </b-nav>
          </b-col>
        </b-row>
      </b-container>
    </footer>
  </div>
</template>
<script>
  import { BaseNav } from '@/components';
  import { ZoomCenterTransition } from 'vue2-transitions';

  export default {
    components: {
      BaseNav,
      ZoomCenterTransition
    },
    props: {
      backgroundColor: {
        type: String,
        default: 'black'
      }
    },
    data() {
      return {
        showMenu: false,
        menuTransitionDuration: 250,
        pageTransitionDuration: 200,
        year: new Date().getFullYear(),
        pageClass: 'login-page'
      };
    },
    computed: {
      title() {
        return `${this.$route.name} Page`;
      }
    },
    methods: {
      toggleNavbar() {
        document.body.classList.toggle('nav-open');
        this.showMenu = !this.showMenu;
      },
      closeMenu() {
        document.body.classList.remove('nav-open');
        this.showMenu = false;
      },
      setBackgroundColor() {
        document.body.classList.add('bg-default');
      },
      removeBackgroundColor() {
        document.body.classList.remove('bg-default');
      },
      updateBackground() {
        if (!this.$route.meta.noBodyBackground) {
          this.setBackgroundColor();
        } else {
          this.removeBackgroundColor()
        }
      }
    },
    beforeDestroy() {
      this.removeBackgroundColor();
    },
    beforeRouteUpdate(to, from, next) {
      // Close the mobile menu first then transition to next page
      if (this.showMenu) {
        this.closeMenu();
        setTimeout(() => {
          next();
        }, this.menuTransitionDuration);
      } else {
        next();
      }
    },
    watch: {
      $route: {
        immediate: true,
        handler: function () {
          this.updateBackground()
        }
      }
    }
  };
</script>
<style lang="scss">
  $scaleSize: 0.8;
  @keyframes zoomIn8 {
    from {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
    100% {
      opacity: 1;
    }
  }

  .main-content .zoomIn {
    animation-name: zoomIn8;
  }

  @keyframes zoomOut8 {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
  }

  .main-content .zoomOut {
    animation-name: zoomOut8;
  }
</style>
