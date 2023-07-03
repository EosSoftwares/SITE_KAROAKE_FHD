import * as types from './types';
// import { getDefaultState } from './state';

const mutations = {
  [types.SET_GENERAL](state, general) {
    state.general = general;
  },
};

export default mutations;
