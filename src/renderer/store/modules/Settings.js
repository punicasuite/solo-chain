const gasPrice = localStorage.getItem('GasPrice') ? parseInt(localStorage.getItem('GasPrice')) : 0;
const state = {
    gasPrice
}

const mutations = {
    UPDATE_SETTING(state, payload) {
        state.gasPrice = payload.gasPrice
    }
}

const actions = {
    saveSettings({ commit }, {gasPrice}) {
        commit('UPDATE_SETTING', {gasPrice})
        localStorage.setItem('GasPrice', gasPrice)
    }
}

export default {
    state,
    mutations,
    actions
}
