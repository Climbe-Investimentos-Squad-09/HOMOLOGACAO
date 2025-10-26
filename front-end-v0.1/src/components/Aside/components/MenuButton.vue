<template>
    <router-link :to="link" >
        <button :type="type" class="btn menu-btn">
            <slot></slot>
            {{ text }}
        </button>
    </router-link>
</template>

<script>
import { RouterLink } from 'vue-router';
export default {
    components: {RouterLink},
    props: {
        type: {
            type: String,
            default: 'button'
        },
        text: {
            type: String,
            required: true
        },
        link: {
            type: String,
            default: ''
        }
    }
}
</script>

<style scoped>
.btn {
    background: transparent;
    border: 1px solid #ccc;
    color: #fff;
    width: 100%;
    padding: .6rem 0;
    border-radius: 5px;
    cursor: pointer;
}

.btn.menu-btn {
    font-size: 16px;
    transition: .3s ease;
}

.btn.menu-btn:hover {
    background-color: var(--theme-color);
    border: 1px solid var(--theme-color);
    border-left: 6px solid #fff;

}
</style>