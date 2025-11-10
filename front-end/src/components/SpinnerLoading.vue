<template>
    <div class="father-container">
        <div class="container">
            <div class="ring"></div>
            <div class="ring"></div>
            <div class="ring"></div>
            <span class="loading">{{ msg ? text : '' }}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        msg: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            text: 'Carregando'
        }
    }
}
</script>

<style scoped>
.loading {
    color: #f0f0f0;
}
.father-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    overflow: hidden;
    background: #011015;
}

.container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    perspective:800px;
}

.ring {
    width: 200px;
    height: 200px;
    border: 0px solid #011015;
    border-radius:  50%;
    position: absolute;
}

.ring:nth-child(1) {
    border-bottom-width: 8px;
    border-color: #f0f0f0 !important;
    animation: rotate1 2s linear infinite;
    z-index: 100;
}

.ring:nth-child(2) {
    border-right-width: 8px;
    border-color: var(--theme-color) !important;
    animation: rotate2 2s linear infinite;
    z-index: 100;
}

.ring:nth-child(3) {
    border-right-width: 8px;
    border-color: #c6395b !important;
    animation: rotate3 2s linear infinite;
    z-index: 100;
}

@keyframes rotate1 {
    0% {
        transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg)
    }
    100% {
        transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg)
    }
}

@keyframes rotate2 {
    0% {
        transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg)
    }
    100% {
        transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg)
    }
}

@keyframes rotate3 {
    0% {
        transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg)
    }
    100% {
        transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg)
    }
}
</style>