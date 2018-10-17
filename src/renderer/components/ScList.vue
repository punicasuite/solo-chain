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

    </div>
</template>

<script>
import {mapState} from 'vuex'
const columns = [
    {
        title: 'TxHash',
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
        }
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
