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
                <a  href="javascript:;" @click="showDetail(record)">详细</a>
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
        title: 'Contract Hash',
        dataIndex: 'contractHash'
    },
    {
        title: 'Contract Name',
        dataIndex: 'name'
    },
    {
        title: 'Version',
        dataIndex: 'version'
    },
    {
        title: 'Author',
        dataIndex: 'author'
    },
    {
        title: 'Email',
        dataIndex: 'email'
    },
    {
        title: 'Need storage',
        dataIndex: 'needStorage'
    },
    {
        title: 'Description',
        dataIndex: 'desc'
    },
    // {
    //     title: '',
    //     key: 'action',
    //     scopedSlots: {customRender:'action'}
    // }
]
export default {
    name: 'ScList',
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
        this.$store.dispatch('fetchScTotal').then(res => {
            this.pagination.total = res;
        })
        this.$store.dispatch('fetchScList', {page:1})
    },
    computed:{
        ...mapState({
            list: state => state.NodeDB.ScList
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
            this.$store.dispatch('fetchScList', {page: pagination.current}).then((res)=>{
                this.loading = false
                this.pagination = pagination;
            })
        }
    }
}
</script>
