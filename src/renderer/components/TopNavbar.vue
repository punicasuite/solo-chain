<style rel="stylesheet/scss" lang="scss" scoped>
    .top-nav-container {
        height: 120px;
        // position: fixed;
        top:0;
        left: 0;
        width:100%;
        background-color:#373a42;
        color: rgb(151,151,151);
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
        margin-right:20px;
    }
    .top-nav-container div p {
        color:rgb(151,151,151);
    }
    .restart-btn {
        border: 1px solid rgb(221, 221, 221);
        height: 30px;
        padding: 5px;
        color: rgb(255, 255, 255);
        position: absolute;
        top: 70px;
        cursor: pointer;
        right: 10px;
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
                <span>http://127.0.0.1:20335</span>
            </div>
                <!-- <a-button class="restart-btn" @click="restart">Restart</a-button> -->
                <a-popconfirm title="Are you sure to restart?" @confirm="confirm" @cancel="cancel" okText="Yes" cancelText="No">
                    <a href="#" class="restart-btn">Restart</a>
                </a-popconfirm>

        </div>
        
    </div>
</template>

<script>
export default {
    name: 'TopNavbar',
    methods: {
        confirm(){
            this.$store.dispatch('restartNode')
            window.location.reload();
        },
        cancel() {

        }
    }
}
</script>
