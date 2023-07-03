import * as types from './types';
// import { getDefaultState } from './state';

const mutations = {
  [types.SET_CART](state, cart) {
    state.cart = cart;
  },
  
  [types.REMOVE_CART](state, indexCart) {
    state.cart = state.cart.filter((cart, iCart) => iCart != indexCart);
  },
  
  [types.CLEAR_CART](state) {
    state.cart = [];
  },
};

export default mutations;
