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
      <!-- Card stats -->
      <b-row>
        <b-col xl="4" md="6">
          <stats-card title="Músicas disponíveis"
              type="gradient-red"
              :sub-title="musics"
              icon="ni ni-headphones">
          </stats-card>
        </b-col>
        <b-col xl="4" md="6">
          <stats-card title="Saldo disponível"
            type="gradient-green"
            :sub-title="general.credits | price"
            icon="ni ni-money-coins">
          </stats-card>

        </b-col>
        <b-col xl="4" md="6">
          <stats-card title="Plano"
            type="gradient-info"
            :sub-title="daysExpire"
            icon="ni ni-chart-bar-32">
          </stats-card>
        </b-col>
      </b-row>
    </base-header>

    <!--Charts-->
    <b-container fluid class="mt--6">
      <b-row>
        <b-col xl="6">
          <card type="default" header-classes="bg-transparent">
            <b-row align-v="center" slot="header">
              <b-col>
                <h6 class="text-light text-uppercase ls-1 mb-1">Crie a sua música</h6>
                <h5 class="h3 text-white mb-0">Youtube</h5>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12" class="d-flex align-items-center flex-column">
                <div class="w-100">
                  <base-input
                    v-model="url"
                    class="w-100 text-white"
                    label="Insira o link da sua música"
                    placeholder="Insira o link da sua música"/>
                </div>
                <base-button @click="convertMusic" type="success">Gerar música</base-button>
              </b-col>
            </b-row>
          </card>
        </b-col>
        <b-col>
          <card header-classes="bg-transparent">
            <b-row align-v="center" slot="header">
              <b-col>
                <h6 class="text-dark text-uppercase ls-1 mb-1">Gerencie suas máquinas</h6>
                <h5 class="h3 text-dark mb-0">Maquinas ativas</h5>
              </b-col>
            </b-row>
            <table v-if="machines.filter(({activeMachine}) => activeMachine).length" class="table">
              <thead>
                <th>Nome</th>
                <th>Ações</th>
              </thead>
              <tbody>
                <tr v-if="machines.filter(({activeMachine}) => activeMachine).length === 0">
                  <td colspan="2">Ops... você não possui nenhuma máquina ativa</td>
                </tr>
                <tr v-for="machine in machines.filter(({activeMachine}) => activeMachine)" :key="machine.userMachineInfoId">
                  <td>{{machine.machineId}}</td>
                  <td>
                    <button @click="removeMachine(machine.userMachineInfoId, machine.machineId)" class="btn btn-sm btn-danger">
                      <span class="ni ni-fat-remove"></span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
  // Components
  import RouteBreadCrumb from '@/components/Breadcrumb/RouteBreadcrumb';
  import StatsCard from '@/components/Cards/StatsCard';

  import { api } from '@/service.js'
  import { mapActions, mapState } from 'vuex'
  export default {
    components: {
      RouteBreadCrumb,
      StatsCard,
    },
    computed:{
      ...mapState('general', ['general']),
      ...mapState('login', ['login']),
      daysExpire(){
        const plan = new Date(this.login.user.planExpiresAt);
        if (plan < new Date()) return "Inativo";
        const diffTime = Math.abs(plan - new Date());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        return `${diffDays} ${diffDays == 1 ? 'Dia' : 'Dias'} para renovação`
      }
    },
    data() {
      return {
        url: "",
        credits: 0,
        musics: 0,
        plan: null,
        machines: null,
      };
    },
    methods: {
      ...mapActions('general', ['setGeneral']),
      getGeneralConfiguration(){
        api.get('/general-configuration').then(({data}) => {
          if(data.isSuccess) {
            this.setGeneral({...data.data, credits: this.credits})
          }
        })
      },
      async getUserCredits() {
        const id = this.login.user.applicationUserId
        const {data: dataCredits} = await api.get(`/credits/converter/${this.login.user.applicationUserId}`)
        this.musics = dataCredits.data.length
        api.get(`/credits/${id}`).then(({data}) => {
          this.credits = data.data.creditsQuantity;
        })
      },
      async getUserMachines(){
        try {
          const {data} = await api.get(`/user/machine/${this.login.user.applicationUserId}`)
          if(data.isSuccess) {
            this.machines = data.data
          }else{
            this.$swal({
              title: 'Ops!',
              text: 'Não foi possível listar suas máquinas',
              icon: 'error'
            })
          return;
          }
        } catch (error) {
          
        }
      },
      convertMusic(){
        if(!this.url) {
          this.$swal({
            title: 'Ops!',
            text: 'Por favor insira o link da música que deseja converter',
            icon: 'error'
          })
          return;
        }
        api.post("/music/convert", {
          urlMusic: this.url,
          applicationUserId: this.login.user.applicationUserId
        }).then(() => {
          this.$swal({
            title: 'Sucesso',
            text: 'Música enviada para processamento. Você receberá um e-mail com o status do processamento',
            icon: 'success'
          });
        }).catch(() => {
          this.$swal({
            title: 'Ops!',
            text: 'Não foi possível converter, por favor tente novamente',
            icon: 'error'
          })
        })
      },
      removeMachine(idMachine, nameMachine){
        this.$swal({
          title: 'Tem certeza?',
          text: 'Você deseja remover a maquina '+nameMachine+'?',
          icon: 'warning',
          confirmButtonText: 'Remover',
          cancelButtonText: 'Não',
          showLoaderOnConfirm: true,
          preConfirm: async () => {
            try {
              const data = await api.patch(`user/remove-machine/${this.login.user.applicationUserId}/${idMachine}`);
              if(data?.response?.status != 200) {
                this.$swal({
                  title: 'Ops!',
                  text: data?.response?.data?.title,
                  icon: 'error',
                })
              }
              console.log("Data", data)
            } catch (error) {
              this.$swal({
                  title: 'Ops!',
                  text: "Não foi possível remover sua máquina. Por favor tente novamente",
                  icon: 'error',
                })
            }
            
          }
        }).then( (result) => {
          
        })
        console.log("Remove machine", idMachine)
      }
    },
    async created(){
      await this.getUserCredits();
      this.getGeneralConfiguration();
      this.getUserMachines();
    }
  };
</script>
<style></style>
