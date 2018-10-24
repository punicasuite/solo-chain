<style scoped>
.logs-container {
    width:100%;
    height:100%;
    padding:15px;
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    height: 100%;
    overflow-y:scroll;
    overflow-x:hidden;
}
.logs-container ul {
    list-style:none;
}
.logs-container ul li {
    margin-bottom:3px;
}
.clear-btn {
    position:fixed;
    top:120px;
    right:10px;
}
</style>
<template>
    <div id="wrapper">
        <div class="logs-container" id="logs-container">
            <ul>
                <li v-for="log in logs">
                    {{log}}
                </li>
            </ul>   
            <a-button type="primary" class="clear-btn" @click="clearLogs">Clear logs</a-button> 
        </div>
        
    </div>
</template>
<script>
import {mapState} from 'vuex'
var logContainer;
export default {
    name: 'Logs',
    computed: {
        ...mapState(
            {
                logs: state => state.Logs.logs
            }
        )
    },
    mounted(){
        logContainer = document.getElementById('logs-container')
        this.interval = setInterval(()=>{
            this.scrollHeight()
        },6000)
    },
    beforeDestroy() {
        clearInterval(this.interval)
    },
    methods: {
        clearLogs(){
            this.$store.commit('CLEAR_LOG_DATA')
        },
        scrollHeight() {
            logContainer.scrollTop = logContainer.scrollHeight;
        }
    }
}
</script>
