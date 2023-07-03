import * as types from './types';

const actions = {
  setLogin: ({commit}, login) => {
    commit(types.SET_LOGIN, login)
  },
  logout: ({commit}) => {
    commit(types.SET_LOGOUT)
    window.localStorage.removeItem('token')
    window.location.href = "/login"
  }
};

export default actions;
