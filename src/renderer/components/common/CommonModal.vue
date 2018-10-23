<style scoped>

</style>

<template>
    <div>
        <a-modal
            :title="title"
            v-model="visible"
            @ok="handleOk"
            @cancel="handleCancel"
            >
            <slot></slot>
        </a-modal>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    name: 'CommonModal',
    props:['modalId', 'title'],
    computed:{
       ...mapState({
           visible: state => state.CommonModal.visible
       })
    },
    methods:{
        handleCancel(){
            this.$store.commit('HIDE_COMMON_MODAL', {modalId: this.modalId})
        },
        handleOk() {
            this.$store.commit('HIDE_COMMON_MODAL')
            this.$emit('modalOk', this.modalId)
        }
    }
    
}
</script>
