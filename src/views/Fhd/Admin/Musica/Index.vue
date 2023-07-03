<template>
  <div>
    <div class="header py-6 d-flex align-items-center"></div>
    <b-container fluid>
      <b-container v-if="!musics">
        <b-row>
          <b-col>
            <b-alert show variant="info">Buscando músicas</b-alert>
          </b-col>
        </b-row>
      </b-container>
      <b-card v-else>
        <b-card-header>Suas músicas</b-card-header>
        <table class="table" v-if="musics.length > 0">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="({musicId, musicName}) in musics" :key="musicId">
              <td>{{musicId}}</td>
              <td>{{musicName}}</td>
              <td>
                <button class="btn btn-info btn">
                  <span class="ni ni-cloud-download-95"></span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <b-container v-else-if="musics.length === 0">
        <b-row>
          <b-col>
            <b-alert show variant="info">No momento você não adquiriu nenhuma música</b-alert>
          </b-col>
        </b-row>
        </b-container>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import { api } from '@/service.js';
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState("login", ['login'])
  },
  data(){
    return {
      musics: null,
    }
  },
  methods: {
    getMusic(){
      api.get(`/credits/converter/${this.login.user.applicationUserId}`).then(({data}) => {
        this.musics = data.data;
      }).catch(() => {
        this.$swal({
          title: 'Ops',
          text: "Ocorreu um erro, por favor tente novamente",
          icon: 'danger',
        });
      })
    }
  },
  created(){
    this.getMusic();
  }
}
</script>