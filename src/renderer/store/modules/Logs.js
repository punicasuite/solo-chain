const state = {
    logs: []
}

const mutations = {
    ADD_LOG_DATA(state, payload) {
        state.logs.push(payload.data)
    },
    CLEAR_LOG_DATA(state, payload) {
        state.logs = []
    }
}

const actions = {
}

export default {
    state,
    mutations,
    actions
}
