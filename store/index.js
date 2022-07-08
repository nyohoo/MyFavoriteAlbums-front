import firebase from '@/plugins/firebase'

export const state = () => ({
 user: {
  uid: '',
  name: '',
  login: false,
 },
})

export const getters = {
 user: state => {
  return state.user
 }
}

export const actions = {
 loginTwitter ({ dispatch }) {
  var provider = new firebase.auth.TwitterAuthProvider()
  firebase.auth().signInWithPopup(provider).then(function (result) {
    dispatch('checkLogin')
  }).catch(function (error) {
    console.log(error)
  })
 },
 checkLogin ({ commit }) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      commit('getData', { uid: user.uid, name: user.name })
      commit('switchLogin')
    }
  })
 },
}

export const mutations = {
 getData (state, payload) {
  state.user.uid = payload.uid
  state.user.name = payload.name
 },
 switchLogin (state) {
  state.user.login = true
 },
}