<style scoped>
.form {
    margin: 20px;
}

.form-item {
    margin-bottom:15px;
}
.form-label {
    font-size:18px;
    font-weight: 500;
    margin-right: 20px;
}
.form-btns {
    margin-top: 30px;
}
.form-btns button {
    width:80px;
    margin-right: 60px;
}
</style>

<template>
    <div id="wrapper">
        <div class="form">
            <div class="form-item">
                <label class="form-label">Gas price: </label>
                <a-select v-model="gasPrice" style="width: 120px" @change="changeGasPrice">
                    <a-select-option value="0">0</a-select-option>
                    <a-select-option value="500">500</a-select-option>
                </a-select>
            </div>

            <div class="form-btns">
                <a-button @click="cancel">Cancel</a-button>
                <a-button type="primary" @click="save">Save</a-button>
            </div>
            
        </div>
    </div>
</template>

<script>
export default {
    name: 'Setting',

    data() {
        const gasPrice = localStorage.getItem('GasPrice') ? parseInt(localStorage.getItem('GasPrice')) : 0;
        return {
            gasPrice
        }
    },
    methods: {
        changeGasPrice(value) {
            console.log(value);
        },
        cancel() {
            this.$router.go(-1);
        },
        save() {
            this.$store.dispatch('saveSettings', {gasPrice: this.gasPrice})
            this.$store.dispatch('stopNode')
            this.$store.dispatch('startNode');
            this.$message.success('Save settings succeed.')
        }
    }

}
</script>
