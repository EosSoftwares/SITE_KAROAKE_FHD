import * as types from './types';

const actions = {
  addCart: ({commit}, plan) => {
    commit(types.SET_CART, plan);
  },
  clearCart: ({commit}) => {
    commit(types.CLEAR_CART);
  }
};

export default actions;
