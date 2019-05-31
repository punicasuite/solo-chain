<style rel="stylesheet/scss" lang="scss" scoped>
    .top-nav-container {
        position: fixed;
        top:0;
        left: 0;
        width:100%;
        background-color:#373a42;
        color: rgb(151,151,151);
        z-index: 1000;
    }
    .nav-list {
        float:left;
        // padding:10px;
        list-style:none;
        margin:0;
        width:100%;
        background-color:#373a42;
        padding-left:10px;
    }
    .nav-list li {
        float: left;
        margin-right: 30px;
        font-size: 20px;
        color: #979797;
        height: 64px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .nav-list li a {
        color: rgb(151,151,151);
    }
    .nav-list li a:hover {
        color:#ffffff;
    }
    .nav-list li a:focus {
        text-decoration: none;
    }
    .nav-active {
        color: #fbe45a !important;
    }
    .top-tab-content {
        float:left;
        display: flex;
        flex:1;
        justify-content: flex-start;
        width:100%;
        background-color: #4b505e;
        color:#fbe45a;
        padding-left:10px;
    }
    .top-tab-content div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-right: 20px;
    }
    .top-nav-container div p {
        color:rgb(151,151,151);
    }
    .restart-btn {
        border: 1px solid rgb(221, 221, 221);
        height: 30px;
        padding: 5px 15px;;
        color: rgb(255, 255, 255);
        cursor: pointer;
        margin-right: 10px;
        text-align: center;
    }
    .start-btns {
        position: absolute;
        top:70px;
        right:10px;
        flex-direction: row !important;
        margin-right: 0 !important;
    }
    .setting-icon {
        float: right !important;
        font-size: 24px !important;
    }
    .setting-nav-active {
        color:#ffffff;
    }

</style>
<template>
    <div class="top-nav-container">
        <ul class="nav-list">
            <li class="nav-item">
                <router-link :to="{name:'Accounts'}" active-class="nav-active">
                    <a-icon type="user" /> Accounts
                </router-link>
            </li>

            <li class="nav-item">
                <router-link :to="{name:'BlockList'}" active-class="nav-active">
                    <a-icon type="appstore-o" /> Blocks
                </router-link>
            </li>

            <li class="nav-item">
                <router-link :to="{name:'TransactionList'}" active-class="nav-active">
                    <a-icon type="swap" /> Transactions
                </router-link>
            </li>

            <li class="nav-item">
                <router-link :to="{name:'EventList'}" active-class="nav-active">
                    <a-icon type="bars" /> Events
                </router-link>
            </li>

            <li class="nav-item">
                <router-link :to="{name:'ScList'}" active-class="nav-active">
                    <a-icon type="file-text" /> Smart Contracts
                </router-link>
            </li>

            <li class="nav-item">
                <router-link :to="{name:'Logs'}" active-class="nav-active">
                    <a-icon type="profile" /> Logs
                </router-link>
            </li>

            <li class="nav-item setting-icon">
                <router-link :to="{name:'Settings'}" active-class="setting-nav-active" >
                    <a-icon type="setting" />
                </router-link>
            </li>


        </ul>
        <div class="top-tab-content">
            <div>
                <p>RPC Server:</p>
                <span>http://127.0.0.1:20336</span>
            </div>
            <div>
                <p>Restful Server:</p>
                <span>http://127.0.0.1:20334</span>
            </div>
            <div>
                <p>Websocket Server:</p>
                <span>ws://127.0.0.1:20335</span>
            </div>
            <div>
                <p>Current Height:</p>
                <span style="text-align:center;">{{currentHeight}}</span>
            </div>
            <div>
                <p>Gas Price:</p>
                <span style="text-align:center;">{{gasPrice}}</span>
            </div>
            <div>
                <p>Gas Limit:</p>
                <span style="text-align:center;">20000</span>
            </div>

            <div class="start-btns">
                <a-popconfirm v-if="nodeStatus === 2" placement="bottom" title="Are you sure to stop the node?" @confirm="confirmStop" @cancel="cancel" okText="Yes" cancelText="No">
                    <a href="#" class="restart-btn">Stop</a>
                </a-popconfirm>
            
                <a href="#" v-if="nodeStatus === 1" class="restart-btn" >Starting...</a>

                <a href="#" v-if="nodeStatus === 0" class="restart-btn" @click="startNode">Start</a>

                <a-popconfirm placement="bottom" title="Are you sure to reboot?It will delete all your local data." @confirm="confirmReboot" @cancel="cancel" okText="Yes" cancelText="No">
                    <a href="#" class="restart-btn">Reboot</a>
                </a-popconfirm>
            </div>
                

        </div>
        
    </div>
</template>

<script>
import {mapState} from 'vuex';
export default {
    name: 'TopNavbar',
    data() {
        return {
            height:0,
            isRuning: true
        }
    },
    computed:{
        ...mapState({
            gasPrice: state => state.Settings.gasPrice,
            currentHeight: state => state.NodeManager.currentHeight,
            nodeStatus: state => state.NodeManager.nodeStatus
        })
    },
    mounted() {
    },
    methods: {
        confirmReboot(){
            this.$store.dispatch('rebootNode')
        },
        cancel() {

        },
        confirmStop() {
            this.$store.dispatch('stopNode');
            this.$message.success('The node has beed stoped.')
            this.isRuning = false;
        },
        startNode() {
            this.$message.success('Starting the node...');
            this.$store.dispatch('startNode');
        }
    }
}
</script>
