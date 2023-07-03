<template>
  <div>
    <base-header type="info" class="pb-6">
      <b-row aling-v="center" class="py-4">
        <b-col cols="7" lg="6">
          <h6 class="h2 text-white d-inline-block mb-0">FHD Karaokê</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-bread-crumb></route-bread-crumb>
          </nav>
        </b-col>
      </b-row>
    </base-header>

    <b-container fluid class="mt--6">
      <b-row class="justify-content-center">
        <b-col lg="12">
          <div class="card-wrapper">
            <!-- Input groups -->
            <card>
              <!-- Card header -->
              <h3 slot="header" class="mb-0">Finalizar</h3>
              <div class="card-body">
                <b-row>
                  <b-col md="6">
                    <base-input class="w-50" v-model="cupom" prepend-icon="ni ni-bag-17" placeholder="Cupom de desconto"></base-input>
                    <base-button :disabled="loadCheckCupom" :loading="loadCheckCupom" @click="checkCupom" class="text-right" type="primary">Verificar</base-button>

                    <hr class="my-3">

                    <select v-model="pagamento" class="form-control">
                      <option value="">Forma de pagamento</option>
                      <option value="CREDIT_CARD">Cartão de crédito</option>
                      <option value="PIX">PIX</option>
                      <option value="BOLETO">Boleto</option>
                    </select>

                    <label for="recurring">
                      <input class="my-3" id="recurring" type="checkbox" v-model="recurring" />
                      Compra recorrente
                    </label>
                  </b-col>
                  <b-col md="6">
                    <h3>Revisão da solicitação</h3>
                    <table class="table">
                      <tr v-for="(c, cIndex) in cart" :key="cIndex">
                        <td>{{c.productName}}</td>
                        <td>{{c.planDescription}}</td>
                        <td>{{c.price | price}}</td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <base-button :disabled="load" :loading="load" @click="finishOrder" class="w-100" type="success">Finalizar pedido</base-button>
                        </td>
                      </tr>
                    </table>
                  </b-col>
                </b-row>
              </div>
            </card>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { api } from '@/service.js'
  export default {
    name: 'form-components',
    components: {

    },
    computed: {
      ...mapGetters('cart', ['cart']),
      ...mapGetters('login', ['login']),
    },
    data() {
      return {
        cupom: "",
        pagamento: "",
        loadCheckCupom: false,
        load: false,
        recurring: false,
      }
    },
    methods: {
      ...mapActions('cart', ['addCart']),
      checkCupom() {
        this.loadCheckCupom = true;
        api.get(`coupon/verify/${this.cupom}/${this.cart[0].planId}`).then(({data}) => {
          if(!data.isSuccess) {
            this.$swal({
              title: 'Ops',
              text: 'Cupom inserido não é válido',
              icon: 'error'
            });
          }else{
            this.$swal({
              title: 'Sucesso',
              text: 'Cupom adicionado com sucesso',
              icon: 'success'
            })
          }
        }).catch(() => this.$swal({
          title: 'Ops',
          text: 'Cupom inserido não é válido',
          icon: 'error'
        })).finally(() => this.loadCheckCupom = false)
      },
      finishOrder(){
        if(!this.pagamento) {
          this.$swal({
            title: 'Ops!',
            text: 'Por favor, selecione o meio de pagamento',
            icon: 'error'
          })
          return;
        }

        if(!this.login?.user?.perfil?.cpfCnpj) {
          this.$swal({
            title: 'Ops!',
            text: 'Por favor, complete o cadastro para concluir',
            icon: 'error',
            confirmButtonText: "Completar",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
              this.$router.push('/admin/user/profile');
            }
          })
          return;
        }

        this.load = true;
        api.post('payment', {
          userEmail: this.login.user.email,
          productPlanId: this.cart[0].productPlanId,
          couponName: this.cupom,
          billingType: this.pagamento,
          authorizeRecurringPayment: this.recurring
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
      this.setUserInfo();
    }
  }
</script>
