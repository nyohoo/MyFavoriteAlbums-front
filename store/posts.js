export const state = () => ({
  post: [],
});

export const actions = {
  addPost({ commit }, post) {
    commit("addPost", post);
  }
};

export const mutations = {
  addPost(state, post) {
    state.post.push(post);
  }
};
