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
              <h3 slot="header" class="mb-0">Carrinho</h3>
              <div class="card-body">
                <h1 v-if="cart.length === 0" class="text-center">Carrinho vazio</h1>
                <table v-else class="table table-responsive">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Plano</th>
                      <th>Recorrência</th>
                      <th>Preço</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(c, cIndex) in cart" :key="cIndex">
                      <td>Produto teste</td>
                      <td>{{c.planDescription}}</td>
                      <td>Mensal</td>
                      <td>{{c.price | price}}</td>
                      <td>
                        <base-button @click="removeCart(cIndex)" size="sm" type="outline-default">
                          <i class="ni ni-fat-remove"></i>
                        </base-button>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="5">
                        <router-link to="/admin/pedido/finalizar" class="btn btn-success w-100">
                          Finalizar sua compra
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
  export default {
    name: 'form-components',
    components: {

    },
    computed: {
      ...mapGetters('cart', ['cart']),
    },
    data() {
      return {
      }
    },
    methods: {
      ...mapActions('cart', ['addCart']),
      removeCart(index){
        this.$swal({
          title: 'Tem certeza?',
          text: "Deseja realmente remove este item?",
          icon: "question",
          confirmButtonText: 'Remover',
          showCancelButton: true,
          cancelButtonText: 'Cancelar'
        }).then(({isConfirmed}) => {
          if(isConfirmed){
            const plan = this.cart
            plan.splice(index, 1)
            this.addCart([...plan])
            this.$notify({
              message: "Item removido do carrinho com sucesso",
              timeout: 5000,
              type: 'default'
            });
          }
        })
      }
    },
    created(){
      this.setUserInfo();
    }
  }
</script>
