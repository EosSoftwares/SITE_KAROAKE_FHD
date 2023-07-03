<template>
  <div>
    <div class="header py-6 d-flex align-items-center"></div>
    <b-container v-if="credits" fluid class="mt--6">
      <b-container v-if="credits.length === 0">
        <b-row>
          <b-col>
            <b-alert show variant="info">Nenhum crédito disponível</b-alert>
          </b-col>
        </b-row>
      </b-container>
      <b-row>
        <b-col xl="12" class="order-xl-1">
          <b-row>
            <b-col
              class="mt-3"
              v-for="credit in credits"
              :key="credit.creditid"
              lg="4">
              <b-card
                no-body
                class="card-profile"
                img-top
              >

                <b-card-body class="pt-0">
                  <div class="text-center">
                    <h5 class="h3">
                      {{credit.name}}
                    </h5>
                    <div class="h5 font-weight-300" v-html="credit.description">
                    </div>
                    <div>
                      <base-button v-b-modal.modal-plan @click="getPackageCredits(credit.creditId)" type="primary" class="my-4">Adquirir pacote de créditos</base-button>
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
            <b-alert show variant="info">Buscando crédito disponíveis</b-alert>
          </b-col>
        </b-row>
      </b-container>

    <b-modal size="lg"  id="modal-plan" ref="modal-credit" title="Créditos">
      <b-container class="mt-2 pb-5">
        <b-row class="justify-content-center">
          <b-col lg="12">
            <b-row>
              <b-col md="12" sm="12">
                <b-card-group class="pricing flex-column flex-md-row mb-3">
                  <card  header-classes="bg-transparent"
                    body-classes="px-lg-3"
                    class="card-pricing border-0 text-center mb-2">
                    <b-row>
                      <b-col md="12">
                        <!-- <base-input class="w-50" v-model="cupom" prepend-icon="ni ni-bag-17" placeholder="Cupom de desconto"></base-input>
                        <base-button :disabled="loadCheckCupom" :loading="loadCheckCupom" @click="checkCupom" class="w-100" type="outline-primary">Verificar</base-button>
                        <hr class="my-3"> -->

                        <select v-model="pagamento" class="form-control">
                          <option value="">Forma de pagamento</option>
                          <option value="CREDIT_CARD">Cartão de crédito</option>
                          <option value="PIX">PIX</option>
                          <option value="BOLETO">Boleto</option>
                        </select>
                        <base-button :disabled="load" :loading="load" @click="finishOrder" class="my-3 w-100" type="success">Finalizar compra</base-button>
                      </b-col>
                    </b-row>
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
    ...mapState('cart', ['cart']),
    ...mapState('login', ['login'])
  },
  data(){
    return {
      showAddModal: false,
      credits: null,
      plans: null,
      product: null,
      cupom: "",
      pagamento: "",
      loadCheckCupom: false,
      load: true,
      recurring: false,
      creditId: null,
    }
  },
  methods: {
    getCredits(){
      api.get(`/credits/active?apikey=${api.apikey}`)
      .then(({data}) => {
        this.credits = data.data
      })
      .catch((error) => {
        console.log(error)
        this.$swal({
          title: 'Ops...!!!',
          text: 'Não foi possível listar os créditos',
          icon: 'error'
        })
      })
    },
    getPackageCredits(idCredit){
      this.creditId = idCredit;
      this.$refs["modal-credit"].show()
    },
    checkCupom() {

    },
    finishOrder() {
      if(!this.pagamento) {
        this.$swal({
          title: 'Ops!',
          text: 'Por favor, selecione o meio de pagamento',
          icon: 'error'
        })
        return;
      }
      this.load = true;
      api.post('/payment/credits', {
        creditId: this.creditId,
        billingType: this.pagamento,
        couponName: this.cupom,
        applicationUserId: this.login.user.applicationUserId
      }).then(({data}) => {
        if(data.isSuccess) {
          this.$swal({
            title: 'Sucesso',
            text: 'Seu pedido foi gerado. Você será redirecionado para concluir o pagamento',
            icon: 'success',
            confirmButtonText: 'Concluir',
            showCancelButton: false,
            showLoaderOnConfirm: true,
            preConfirm: async () => {
              window.location.href = data.data.paymentUrl;
            }
          })
        }else{
          this.$swal({
            title: 'Ops',
            text: data?.title ?? 'Não foi possível gerar o pagamento',
            icon: 'danger',
            confirmButtonText: 'Concluir',
            showCancelButton: false,
          });
        }
      }).catch(() => {
        this.$swal({
          title: 'Ops',
          text: "Ocorreu um erro, por favor tente novamente",
          icon: 'danger',
        });
      }).finally(() => this.load = false)
    }
  },
  created(){
    this.getCredits()
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
