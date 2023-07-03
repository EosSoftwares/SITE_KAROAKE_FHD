<template>
  <div>
    <div class="header py-6 d-flex align-items-center"></div>
    <b-container v-if="packages" fluid class="mt--6">
      <b-row v-if="packages.length === 0">
        <b-col>
          <b-alert show variant="info">Nenhum pacote disponível no momento</b-alert>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col xl="12" class="order-xl-1">
          <b-row>
            <b-col
              class="mt-3"
              v-for="pack in packages"
              :key="pack.musicPackageId"
              lg="4">
              <b-card
                no-body
                class="card-profile"
                img-top
              >
                <b-row class="justify-content-center">
                  <b-col lg="3" class="order-lg-2">
                    <div class="card-profile-image">
                      <a href="#">
                        <b-img :src="pack.bannerImage"/>
                      </a>
                    </div>
                  </b-col>
                </b-row>

                <b-card-header
                  class="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4"
                >
                </b-card-header>

                <b-card-body class="pt-0">
                  <div class="text-center">
                    <h5 class="h3">
                      {{pack.packageName}}
                    </h5>
                    <div class="h5 font-weight-300">
                      {{pack.musics.length}} músicas disponíveis
                    </div>
                    <div>
                      <base-button v-b-modal.modal-plan @click="getPack(pack.musicPackageId)" type="primary" class="my-4">Ver pacote</base-button>
                    </div>
                  </div>
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
    <b-container v-else>
        <b-row>
          <b-col>
            <b-alert show variant="info">Buscando pacotes</b-alert>
          </b-col>
      </b-row>
    </b-container>

    
    <b-modal size="lg"  id="modal-plan" ref="modal-music" title="Pacote de música">
      <b-container class="mt-2 pb-5">
        <b-row class="justify-content-center">
          <b-col lg="12">
            <b-row v-if="music">
              <b-col md="6" sm="12">
                <b-card-group class="pricing flex-column flex-md-row mb-3">
                  <card  header-classes="bg-transparent"
                    body-classes="px-lg-3"
                    class="card-pricing border-0 text-center mb-2">
                    <h4 slot="header" class="text-uppercase ls-1 text-primary py-1 mb-0">{{music.packageName}}</h4>
                    <ul class="list-unstyled my-4">
                      <li v-for="(m, mi) in music.musics" :key="mi">
                        <div class="d-flex align-items-center">
                          <span>{{m.musicName}}</span>
                        </div>
                      </li>
                    </ul>
                  </card>
                </b-card-group>
              </b-col>

            </b-row>
          </b-col>
        </b-row>
      </b-container>
      <template #modal-footer>&nbsp;</template>
    </b-modal>
  </div>
</template>
<script>
import { api } from '@/service.js'
import { mapActions, mapState } from 'vuex'
export default {
  components: {
  },
  computed: {
    ...mapState('cart', ['cart'])
  },
  data(){
    return {
      showAddModal: false,
      packages: null,
      music: null
    }
  },
  methods: {
    ...mapActions('cart', ['addCart', 'clearCart']),
    showModal(showModal) {
      this.$refs[showModal].show()
    },
    getPackagesMusic(){
      api.get(`/music/packages/active?apiKey=${api.apikey}`)
      .then(({data}) => {
        this.packages = data.data
      })
      .catch((error) => {
        console.log(error)
        this.$swal({
          title: 'Ops...!!!',
          text: 'Não foi possível listar os pacotes de música',
          icon: 'error'
        })
      })
    },
    getPack(musicPackageId) {
      this.music = this.packages.filter(p => p.musicPackageId === musicPackageId)[0];
      this.showModal('modal-music')
    }
  },
  created(){
    this.getPackagesMusic()
  }
};
</script>
<style>
.profile-header {
  background-image: url(/img/theme/profile-cover.jpg);
  background-size: cover;
  background-position: center top;
  min-height: 500px;
}
</style>
