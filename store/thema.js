export const state = () => ({
  theme: false,
});

export const mutations = {
  theme(state, theme) {
    state.theme = theme
  }
}

export const actions = {
  theme({
    commit
  }, theme) {
    commit('theme', theme)
  }
}