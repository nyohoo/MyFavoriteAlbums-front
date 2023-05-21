export const state = () => ({
  message: "",
  type: "",
  status: false,
})

export const getters = {
  message: state => state.message,
  type: state => state.type,
  status: state => state.status,
}

export const actions = {
  setMessage({ commit }, payload) {
    commit("setMessage", payload)
    setTimeout(() => {
      commit("setMessage", { message: "", type: "", status: false })
    }, 2000)
  },
}

export const mutations = {
  setMessage(state, payload) {
    state.message = payload.message
    state.type = payload.type
    state.status = payload.status
  }
}
