const state = {
    loading: false
}

const mutations = {
    SHOW_LOADING(state) {
        state.loading = true;
    },
    HIDE_LOADING(state) {
        state.loading = false;
    }
}

const actions = {
    showLoading({ commit }) {
        commit('SHOW_LOADING')
    },
    hideLoading({ commit }) {
        commit('HIDE_LOADING')
    }
}

export default {
    state,
    mutations,
    actions
}
