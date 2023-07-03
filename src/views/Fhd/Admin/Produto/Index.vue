<template>
  <div>
    <div class="header py-6 d-flex align-items-center"></div>
    <b-container v-if="products" fluid class="mt--6">
      <b-row>
        <b-col xl="12" class="order-xl-1">
          <b-row>
            <b-col
              class="mt-3"
              v-for="product in products"
              :key="product.productId"
              lg="12">
              <b-card
                no-body
                class="card-profile"
                img-top
              >
                <b-row class="justify-content-center">
                  <b-col lg="3" class="order-lg-2">
                    <div class="card-profile-image">
                      <a href="#">
                        <b-img :src="product.images[0].url"/>
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
                      {{product.name}}
                    </h5>
                    <div class="h5 font-weight-300" v-html="product.description">
                    </div>
                    <div>
                      <base-button v-b-modal.modal-plan @click="getPlans(product.productId)" type="primary" class="my-4">Ver planos</base-button>
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
          <b-alert show variant="info">Buscando produtos</b-alert>
        </b-col>
      </b-row>
    </b-container>
    <b-modal size="lg"  id="modal-plan" ref="modal-plan" title="Planos">
      <b-container class="mt-2 pb-5">
        <b-row class="justify-content-center">
          <b-col lg="12">
            <div class="d-flex justify-content-center" v-if="!plans">
              Buscando planos...
            </div>
            <b-row>
              <b-col md="6" sm="12" v-for="(plan, planIndex) in plans" :key="plan.planId">
                <b-card-group class="pricing flex-column flex-md-row mb-3">
                  <card  header-classes="bg-transparent"
                    body-classes="px-lg-3"
                    class="card-pricing border-0 text-center mb-2">
                    <h4 slot="header" class="text-uppercase ls-1 text-primary py-1 mb-0">{{plan.planDescription}}</h4>

                    <div class="display-2">{{plan.price | price}}</div>
                    <ul class="list-unstyled my-4">
                      <li>
                        <div class="d-flex align-items-center">
                          <div>
                            <div class="icon icon-xs icon-shape bg-gradient-primary shadow rounded-circle text-white">
                              <i class="fas fa-hdd"></i>
                            </div>
                          </div>
                          <div>
                            <span class="pl-2">Maquinas: {{plan.machines}}</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <base-button type="primary" @click="savePlan(planIndex)" class="mb-3">Adquirir</base-button>
                  </card>
                </b-card-group>
              </b-col>
              <b-col md="12" v-if="plans && plans.length === 0">
                <b-alert show variant="info">Nenhum produto disponível</b-alert>
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
      products: null,
      plans: null,
      product: null
    }
  },
  methods: {
    ...mapActions('cart', ['addCart', 'clearCart']),
    showModal(showModal) {
      this.$refs[showModal].show()
    },
    getProducts(){
      api.get(`/product/active?apiKey=${api.apikey}`)
      .then(({data}) => {
        this.products = data.data
      })
      .catch((error) => {
        console.log(error)
        this.$swal({
          title: 'Ops...!!!',
          text: 'Não foi possível listar os produtos',
          icon: 'error'
        })
      })
    },
    getPlans(idProduct){

      const {productId, name: productName} = this.products.filter(({productId}) => productId === idProduct)[0]
      this.product = {productId, productName};
      this.plans = null;
      api.get(`plan/product/${idProduct}`)
      .then(({data}) => {
        this.plans = data.data
      })
      .catch((error) => {
        this.$swal({
          title: 'Ops...!!!',
          text: 'Não foi possível listar os planos',
          icon: 'error'
        })
      })
    },
    savePlan(planIndex) {
      this.$notify({
        message: "Item adicionado ao carrinho com sucesso",
        timeout: 5000,
        type: 'success'
      });
      const plan = {...this.product, ...this.plans[planIndex]};
      this.addCart([plan])
      this.$router.push('/admin/pedido/finalizar')
    }
  },
  created(){
    this.getProducts()
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
