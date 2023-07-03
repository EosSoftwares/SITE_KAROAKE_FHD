<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9">
      <b-container>
        <div class="header-body text-center mb-7">
          <b-row class="justify-content-center">
            <b-col xl="5" lg="6" md="8" class="px-5">
              <h1 class="text-white">Bem vindo!</h1>
            </b-col>
          </b-row>
        </div>
      </b-container>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </div>
    <!-- Page content -->
    <b-container class="mt--8 pb-5">
      <b-row class="justify-content-center">
        <b-col lg="5" md="7">
          <b-card no-body class="bg-secondary border-0 mb-0">
            <b-card-body class="px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
              </div>
              <validation-observer v-slot="{handleSubmit}" ref="formValidator">
                <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input alternative
                              class="mb-3"
                              name="Email"
                              :rules="{required: true, email: true}"
                              prepend-icon="ni ni-email-83"
                              placeholder="Email"
                              v-model="model.email">
                  </base-input>

                  <base-input alternative
                              class="mb-3"
                              name="Password"
                              :rules="{required: true, min: 6}"
                              prepend-icon="ni ni-lock-circle-open"
                              type="password"
                              placeholder="Senha"
                              v-model="model.password">
                  </base-input>
                  <div class="text-center">
                    <base-button :disabled="load" :loading="load" type="primary" native-type="submit" class="my-4">Acessar</base-button>
                  </div>
                </b-form>
              </validation-observer>
            </b-card-body>
          </b-card>
          <b-row class="mt-3">
            <b-col cols="6">
              <router-link to="/recovery" class="text-light"><small>Esqueceu sua senha?</small></router-link>
            </b-col>
            <b-col cols="6" class="text-right">
              <router-link to="/register" class="text-light"><small>Criar uma nova conta</small></router-link>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import { api, generateUUID} from '@/service.js'
  export default {
    data() {
      return {
        load: false,
        model: {
          email: '',
          password: '',
          rememberMe: false
        }
      };
    },
    methods: {
      ...mapActions('login', ['setLogin']),
      async onSubmit() {
        this.load = true;
        this.model.deviceId = generateUUID();
        api.post('user/login', this.model)
        .then(async ({data, status}) => {
          if(status === 200) {
            data.data.deviceId = this.model.deviceId
            window.localStorage.setItem("token", data.data.token)
            try {
              const {data: dataUser} = await api.get('/user/customer')
              data.data.user.perfil = dataUser.data
            } catch (error) {
              console.error("Não foi possível carregar dados")
            }
            this.setLogin(data.data)
            this.$router.push('/admin/dashboard');
          }else{
            this.$swal({
              title: 'Ops...!',
              text: "E-mail ou senha inseridos são inválidos",
              icon: 'error',
              confirmButtonText: 'Ok',
              showCancelButton: false,
            });
          }
        }).catch( ({response}) => {
          console.log(response)
          if(response?.data?.title?.includes('validar')) {
            this.$swal({
              title: 'Conta não confirmada',
              text: 'Gostaria de confirmar agora?',
              icon: 'warning',
              confirmButtonText: 'Confirmar',
              cancelButtonText: 'Não',
              showLoaderOnConfirm: true,
              preConfirm: async () => {
                await api.get(`user/generate/token/${this.model.email}`)
                .then(({data}) => {
                  return data
                })
              }
            }).then( (result) => {
              this.$swal({
                title: 'Token enviado com sucesso!',
                text: 'Digite abaixo o token enviado no seu e-mail',
                input: 'text',
                showLoaderOnConfirm: true,
                preConfirm: async (token) => {
                  await api.post('user/validate/token', {
                    email: this.model.email,
                    code: token
                  }).then(({data}) => {
                    return data
                  }).catch(error => {
                    this.$swal.showValidationMessage('Token inválido, por favor tente novamente');
                  })
                }
              }).then(() => {
                this.$swal({
                  title: 'Sucesso',
                  text: "Token confirmado!",
                  icon: 'success',
                  confirmButtonText: 'Acessar plataforma!',
                  showCancelButton: false,
                }).then(this.onSubmit());
              })
            })
          }else{
            this.$swal({
              title: 'Ops...!',
              text: response.data.title,
              icon: 'error',
              confirmButtonText: 'Ok',
              showCancelButton: false,
            });
          }

        }).
        finally(() => this.load = false)
        
      }
    }
  };
</script>
