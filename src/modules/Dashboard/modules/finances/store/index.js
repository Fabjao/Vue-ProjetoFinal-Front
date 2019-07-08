import actions from './actions'
import mutations from './mutation'

const state = {
  filters: undefined,
  isFiltering: false,
  month: undefined
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
