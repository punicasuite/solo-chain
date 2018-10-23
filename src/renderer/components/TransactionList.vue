<style scoped>

</style>

<template>
    <div id="wrapper">
        <div>
            <a-table :columns="columns"
                :rowKey="record => record._id"
                :dataSource="list"
                :pagination="pagination"
                :loading="loading"
                @change="handleTableChange"
            >
            <div slot="action" slot-scope="text, record" class="detail-link" >
                <a  href="javascript:;" @click="showDetail(record)">Detail</a>
            </div>
            </a-table>
        </div>
    <common-modal modalId="modal1"  title="Block detail" >
      <json-viewer :value="json"></json-viewer>
    </common-modal>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import CommonModal from './common/CommonModal' 
const columns = [
    {
        title: 'Type',
        dataIndex: 'type'
    },
    {
        title: 'Hash',
        dataIndex: 'hash'
    },
    {
        title: 'height',
        dataIndex: 'height'
    },
    {
        title: '',
        key: 'action',
        scopedSlots: {customRender:'action'}
    }
]
export default {
    name: 'TransactionList',
    data(){
        return {
            pagination: {
                current: 1,
                pageSize:10,
                total:50
            },
            loading: false,
            columns,
            json: ''
        }
    },
    components: {
        CommonModal
    },
    mounted(){
        this.$store.dispatch('fetchTxTotal').then(res => {
            this.pagination.total = res;
        })
        this.$store.dispatch('fetchTxList', {page:1})
    },
    computed:{
        ...mapState({
            list: state => state.NodeDB.TxList
        })
    },
    methods: {
        showDetail(record){
            console.log(record.json)
            this.json = record.json
            this.$store.commit('SHOW_COMMON_MODAL')
        },
        handleTableChange(pagination, filters, sorter) {
            console.log(pagination)
            this.loading = true
            this.$store.dispatch('fetchTxList', {page: pagination.current}).then((res)=>{
                this.loading = false
                this.pagination = pagination;
            })
        }
    }
}
</script>
