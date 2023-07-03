import * as types from './types';
// import { getDefaultState } from './state';

const mutations = {
  [types.SET_LOGIN](state, login) {
    state.login = login;
  },
  
  [types.SET_LOGOUT](state) {
    state.login = {login: null};
  },
};

export default mutations;
