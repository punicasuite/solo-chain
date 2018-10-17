const state = {
    visible: false
}

const mutations = {
    SHOW_COMMON_MODAL(state, payload) {
        state.visible = true;
    },
    HIDE_COMMON_MODAL(state, payload) {
        state.visible = false;
    }
}

const actions = {

}

export default {
    state,
    mutations,
    actions
}
