import * as types from './types';

const actions = {
  setGeneral: ({commit}, general) => {
    commit(types.SET_GENERAL, general);
  }
};

export default actions;
