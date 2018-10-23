import * as DB from '../../../core/dbService'
const pageSize = 10;
const state = {
    BlockList: [],
    TxList: [],
    EventList: [],
    ScList: []
}

const mutations = {
    UPDATE_BLOCK_LIST(state, payload) {
        state.BlockList = payload.list
    },
    UPDATE_EVENT_LIST(state, payload) {
        state.EventList = payload.list
    },
    UPDATE_TX_LIST(state, payload) {
        state.TxList = payload.list
    },
    UPDATE_SC_LIST(state, payload) {
        state.ScList = payload.list
    },
}

const actions = {
    async fetchBlockTotal(){
        const total = await DB.dbFind(DB.blockDB, {})
        return total.length;
    },
    async fetchEventTotal() {
        const total = await DB.dbFind(DB.eventDB, {})
        return total.length;
    },
    async fetchTxTotal() {
        const total = await DB.dbFind(DB.txDB, {})
        return total.length;
    },
    async fetchScTotal() {
        const total = await DB.dbFind(DB.scDB, {})
        return total.length;
    },
    async fetchBlockList({ commit }, {page}) {
        // DB.blockDB.find({}).skip(pageSize*(page-1)).limit(pageSize).exec((err, docs) => {
        //     if(err) throw err;
        //     commit('UPDATE_BLOCK_LIST', {list: docs})
        //     return docs;
        // })
        const docs = await DB.dbFind(DB.blockDB, {}, page)
        commit('UPDATE_BLOCK_LIST', { list: docs })
        return docs;
    },
    async fetchEventList({ commit }, { page }) {
        // DB.eventDB.find({}).skip(pageSize * (page - 1)).limit(pageSize).exec((err, docs) => {
        //     if (err) throw err;
        //     commit('UPDATE_EVENT_LIST', { list: docs })
        //     return docs;
        // })
        const docs = await DB.dbFind(DB.eventDB, {}, page)
        commit('UPDATE_EVENT_LIST', { list: docs })
        return docs;
    },
    async fetchTxList({ commit }, { page }) {
        // DB.txDB.find({}).skip(pageSize * (page - 1)).limit(pageSize).exec((err, docs) => {
        //     if (err) throw err;
        //     commit('UPDATE_TX_LIST', { list: docs })
        //     return docs;
        // })
        const docs = await DB.dbFind(DB.txDB, {}, page)
        commit('UPDATE_TX_LIST', { list: docs })
        return docs;
    },
    async fetchScList({ commit }, { page }) {
        // DB.scDB.find({}).skip(pageSize * (page - 1)).limit(pageSize).exec((err, docs) => {
        //     if (err) throw err;
        //     commit('UPDATE_SC_LIST', { list: docs })
        //     return docs;
        // })
        const docs = await DB.dbFind(DB.scDB, {}, page)
        commit('UPDATE_SC_LIST', { list: docs })
        return docs;
    },
    removeDB({dispatch, commit}) {
        const query = {}, opt = {multi:true};
        dispatch('removeBlockDB', {query, opt});
        dispatch('removeEventDB', { query, opt });
        dispatch('removeScDB', { query, opt });
        dispatch('removeTxDB', { query, opt });
    },
    async removeBlockDB({}, {query, opt}) {
        const res = await DB.dbRemove(DB.blockDB, query, opt);
        return res;
    },
    async removeEventDB({}, {query, opt}) {
        const res = await DB.dbRemove(DB.eventDB, query, opt);
        return res;
    },
    async removeScDB({ }, { query, opt }) {
        const res = await DB.dbRemove(DB.scDB, query, opt);
        return res;
    },
    async removeTxDB({ }, { query, opt }) {
        const res = await DB.dbRemove(DB.txDB, query, opt);
        return res;
    }
}

export default {
    state,
    mutations,
    actions
}
