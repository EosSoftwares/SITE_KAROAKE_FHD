<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9">
      <b-container class="container">
        <div class="header-body text-center mb-7">
          <b-row class="justify-content-center">
            <b-col xl="5" lg="6" md="8" class="px-5">
              <h1 class="text-white">Criar conta</h1>
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
      <!-- Table -->
      <b-row class="justify-content-center">
        <b-col lg="6" md="8" >
          <b-card no-body class="bg-secondary border-0">
            <b-card-body class="px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
              </div>
              <validation-observer v-slot="{handleSubmit}" ref="formValidator">
                <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input alternative
                              class="mb-3"
                              prepend-icon="ni ni-hat-3"
                              placeholder="Nome"
                              name="Nome"
                              :rules="{required: true}"
                              v-model="model.firstName">
                  </base-input>
                  <base-input alternative
                              class="mb-3"
                              prepend-icon="ni ni-hat-3"
                              placeholder="Sobrenome"
                              name="Sobrenome"
                              :rules="{required: true}"
                              v-model="model.lastName">
                  </base-input>

                  <base-input alternative
                              class="mb-3"
                              prepend-icon="ni ni-email-83"
                              placeholder="E-mail"
                              name="Email"
                              :rules="{required: true, email: true}"
                              v-model="model.email">
                  </base-input>

                  <base-input alternative
                              class="mb-3"
                              prepend-icon="ni ni-lock-circle-open"
                              placeholder="Senha"
                              type="password"
                              name="Senha"
                              :rules="{required: true, min: 6}"
                              v-model="model.password">
                  </base-input>
                  <b-row class=" my-4">
                    <b-col cols="12">
                      <base-input :rules="{ required: { allowFalse: false } }" name=Privacy Policy>
                        <b-form-checkbox v-model="model.agree">
                          <span class="text-muted">Eu aceito a <a target="_blank" href="/politica-de-privacidade">Politíca de privacidade</a></span>
                        </b-form-checkbox>
                      </base-input>
                    </b-col>
                  </b-row>
                  <div class="text-center">
                    <b-button :disabled="load" type="submit" variant="primary" class="mt-4">Criar conta</b-button>
                  </div>
                </b-form>
              </validation-observer>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
  import { api } from '@/service.js'
  export default {
    name: 'register',
    data() {
      return {
        load: false,
        model: {
          name: '',
          email: '',
          password: '',
          agree: false
        }
      }
    },
    methods: {
      async onSubmit() {
        this.load = true;
        const { email, firstName, lastName, password } = this.model;
        api.post('user/register/site', {
          email,
          firstName,
          lastName,
          password,
        }).then(() => { 
          this.$swal({
            title: 'Conta cadastrada com sucesso!',
            text: 'Último passo! você precisa confirmar seu e-mail!',
            icon: 'success',
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
              icon: 'success',
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
              }).then(this.$router.push('login'));
            })
          })


        }).catch( ({response}) => {
          this.$swal({
            title: 'Ops!!!',
            text: response.data.title,
            icon: 'error',
          })
        }).
        finally(this.load = false)
      }
    }

  };
</script>
<style></style>
