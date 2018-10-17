<style rel="stylesheet/scss" lang="scss" scoped>
    .top-nav-container {
        height: 64px;
        line-height: 64px;
        // position: fixed;
        top:0;
        left: 0;
        width:100%;
        background-color:#373a42;
    }
    .nav-list {
        float:left;
        // padding:10px;
        list-style:none;
    }
    .nav-list li {
        float: left;
        margin-left: 20px;
        font-size:20px;
        color: rgb(151,151,151);
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
        </ul>
        
    </div>
</template>

<script>
export default {
    name: 'TopNavbar'
}
</script>
