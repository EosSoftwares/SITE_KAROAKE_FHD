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
        <b-col lg="6">
          <div class="card-wrapper">
            <!-- Input groups -->
            <card>
              <!-- Card header -->
              <h3 slot="header" class="mb-0">Perfil</h3>
              <!-- Card body -->
              <form @submit.prevent="saveProfile">
                <!-- Input groups with icon -->
                <b-row>
                  <b-col md="6">
                    <base-input v-model="inputs.name" placeholder="Nome"></base-input>
                  </b-col>
                  <b-col md="6">
                    <base-input v-model="inputs.email" placeholder="E-mail"></base-input>
                  </b-col>
                  <b-col md="6">
                    <base-input>
                      <the-mask
                        v-model="inputs.phone"
                        placeholder="Telefone"
                        class="form-control"
                        :mask="['(##) #####-####']" />
                    </base-input>
                  </b-col>
                  <b-col md="6">
                    <base-input>
                      <the-mask
                        v-model="inputs.mobilePhone"
                        placeholder="Celular"
                        class="form-control"
                        :mask="['(##) #####-####']" />
                    </base-input>
                  </b-col>
                  <b-col md="6">
                    <base-input>
                      <the-mask
                        v-model="inputs.cpfCnpj"
                        placeholder="CPF / CNPJ"
                        class="form-control"
                        :mask="['###.###.###-##', '##.###.####/####-##']" />
                    </base-input>
                  </b-col>
                  <b-col md="6">
                    <base-input>
                      <the-mask
                        v-model="inputs.postalCode"
                        @keyup.native="getInputCep"
                        placeholder="CEP"
                        class="form-control"
                        mask="#####-###" />
                    </base-input>
                  </b-col>
                  <b-col md="6">
                    <base-input v-model="inputs.address" placeholder="Logradouro"></base-input>
                  </b-col>
                  <b-col md="6">
                    <base-input v-model="inputs.addressNumber" placeholder="Número"></base-input>
                  </b-col>
                  <b-col md="6">
                    <base-input v-model="inputs.complement" placeholder="Complemento"></base-input>
                  </b-col>
                  <b-col md="6">
                    <base-input v-model="inputs.district" placeholder="Bairro"></base-input>
                  </b-col>
                  <b-col md="6">
                    <base-input v-model="inputs.city" placeholder="Cidade"></base-input>
                  </b-col>
                  <b-col md="6">
                    <base-input v-model="inputs.state" placeholder="Estado"></base-input>
                  </b-col>
                  <b-col md="12">
                    <base-input v-model="inputs.observations" placeholder="Observações"></base-input>
                  </b-col>
                  <b-col md="12" class="d-flex justify-content-center">
                    <base-button @click="saveProfile" :loading="loading" type="success">Salvar</base-button>
                  </b-col>
                </b-row>
              </form>
            </card>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { api, getCep} from '@/service.js'
  export default {
    name: 'form-components',
    components: {

    },
    computed: {
      ...mapGetters('login', ['login']),
    },
    data() {
      return {
        loading: false,
        inputs: {
          name: "",
          email: "",
          phone: "",
          mobilePhone: "",
          cpfCnpj: "",
          postalCode: "",
          address: "",
          addressNumber: "",
          complement: "",
          district: "",
          state: "",
          province: "",
          observations: "",
          additionalEmails: "",
          externalReference: "",
        }
      }
    },
    methods: {
      async getInputCep() {
        console.log(this.inputs.postalCode)
        if(this.inputs.postalCode.length === 8) {
          const {data} = await getCep(this.inputs.postalCode)
          this.inputs.address = data.logradouro;
          this.inputs.district = data.bairro;
          this.inputs.city = data.localidade;
          this.inputs.state = data.uf
        }
      },
      setUserInfo() {
        const {firstName, lastName, email} = this.login.user;
        console.log(this.login.user)
        this.inputs = Object.assign(this.inputs, this.login.user.perfil)
        console.log(this.inputs)
        this.inputs = {...this.inputs, name: `${firstName} ${lastName}`, email}

      },
      saveProfile(){
        this.loading = true;
        const objectSave = {}
        for(let i in this.inputs) {
            objectSave[i] = this.inputs[i] || ""
        }
        api.post('user/complete-registration', objectSave)
        .then(({data}) => {
          this.$swal({
            icon: 'success',
            title: 'Perfil salvo com sucesso'
          })
        })
        .catch(({error}) => {
          this.$swal({
            icon: 'error',
            title: 'Não foi possível salvar. Por favor tente novamente'
          })
        }).
        finally(() => this.loading = false);
      }
    },
    created(){
      this.setUserInfo();
    }
  }
</script>
