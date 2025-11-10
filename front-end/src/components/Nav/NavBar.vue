<template>
    <nav class="navbar">
        <div class="navbar-left">
            <breadcrumb :items="breadcrumb" :title="title"/>
        </div>

        <div class="navbar-right">
            <!-- Necessitam de melhorias em CSS além de utilizar o componente Button para isso caso forem utilizar no projeto de vocês utilizem o componente e façam o CSS por lá -->
            <!-- <button class="action-btn notification-btn" title="Notificações">
                <i class="bi bi-bell"></i>
                <span class="notification-badge">3</span>
            </button>

            <button class="action-btn settings-btn" title="Configurações">
                <i class="bi bi-gear"></i>
            </button> -->

            <!-- <div class="divider"></div> -->

            <button class="leave-btn" title="Sair do sistema" @click="handleLogout">
                <div class="leave-btn-content">
                    <i class="bi bi-arrow-bar-right"></i>
                    <span class="leave-text">Sair</span>
                </div>
            </button>
        </div>
    </nav>
</template>

<script>
import Breadcumb from './Breadcumb/Breadcumb.vue';

export default {
    components: { 
        breadcrumb: Breadcumb 
    },
    props: {
        breadcrumb: {
            type: Array,
            default: () => []
        },
        title: {
            type: String, 
            default: ''
        }
    },
    methods: {
        handleLogout() {
            Exemplo: this.$router.push('/');
        }
    }
}
</script>

<style scoped>
.navbar {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    backdrop-filter: blur(10px);
}

.navbar::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
}

.navbar-left {
    flex: 1;
    display: flex;
    align-items: center;
}

.navbar-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.action-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.625rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    min-width: 40px;
    height: 40px;
}

.action-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.action-btn i {
    color: #94a3b8;
    font-size: 16px;
    transition: color 0.3s ease;
}

.action-btn:hover i {
    color: #f8fafc;
}

.notification-btn {
    position: relative;
}

.notification-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    font-size: 0.7rem;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
}

.divider {
    width: 1px;
    height: 24px;
    background: rgba(255, 255, 255, 0.15);
    margin: 0 0.5rem;
}

.leave-btn {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    overflow: hidden;
}

.leave-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
}

.leave-btn:hover::before {
    left: 100%;
}

.leave-btn:hover {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%);
    border-color: rgba(239, 68, 68, 0.5);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
}

.leave-btn-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    z-index: 1;
}

.leave-btn i {
    color: #ef4444;
    font-weight: bold;
    font-size: 16px;
    transition: all 0.3s ease;
}

.leave-text {
    color: #ef4444;
    font-size: 0.875rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.leave-btn:hover i,
.leave-btn:hover .leave-text {
    color: #fca5a5;
    transform: translateX(2px);
}

.leave-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
}

@media (max-width: 768px) {
    .navbar {
        padding: 0 1rem;
        height: 60px;
    }
    
    .navbar-right {
        gap: 0.5rem;
    }
    
    .action-btn {
        min-width: 36px;
        height: 36px;
        padding: 0.5rem;
    }
    
    .leave-text {
        display: none;
    }
    
    .leave-btn {
        padding: 0.5rem;
        min-width: 36px;
    }
    
    .notification-badge {
        font-size: 0.6rem;
        min-width: 16px;
        height: 16px;
        padding: 1px 4px;
    }
}

@media (max-width: 480px) {
    .notification-btn,
    .settings-btn,
    .divider {
        display: none;
    }
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.notification-badge {
    animation: pulse 2s infinite;
}

.action-btn:focus,
.leave-btn:focus {
    outline: 2px solid rgba(59, 130, 246, 0.5);
    outline-offset: 2px;
}
</style>