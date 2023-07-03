import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

// Load store modules dynamically.
const files = require.context('@/store/modules', true, /index\.js$/);
const modules = {};

files.keys().forEach((key) => {
  let name = key.replace(/(\.\/|\.js)/g, '').replace(/\/index/g, '');
  modules[name] = files(key).default;
});


const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  plugins: [vuexLocal.plugin],
});
