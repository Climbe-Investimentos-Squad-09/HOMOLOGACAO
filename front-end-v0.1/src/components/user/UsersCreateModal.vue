<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Adicionar usuário:</h2>
                <button class="close-button" @click="$emit('close')">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="full-name">Nome completo:</label>
                    <input type="text" id="full-name" placeholder="Insira o nome completo" />
                </div>

                <div class="form-group">
                    <label for="corporate-email">Email corporativo:</label>
                    <input type="email" id="corporate-email" placeholder="nome@company.com" />
                </div>

                <div class="form-group">
                    <label for="personal-email">Email pessoal:</label>
                    <input type="email" id="personal-email" placeholder="nome@company.com" />
                </div>

                <div class="form-group">
                    <label for="cpf">CPF:</label>
                    <input type="text" id="cpf" placeholder="000.000.000-00" />
                </div>

                <div class="form-group">
                    <label for="phone">Telefone:</label>
                    <input type="text" id="phone" placeholder="DDD 999999999" />
                </div>

                <div class="form-group">
                    <label for="role">Cargo:</label>
                    <select id="role">
                        <option selected disabled>Selecione um cargo</option>
                        <option>Administrador</option>
                        <option>Analista</option>
                        <option>Gerente</option>
                    </select>
                </div>
            </div>

            <div class="modal-footer">
                <button class="cancel-button" @click="$emit('close')">Cancelar</button>
                <button class="add-user-button">Adicionar usuário</button>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #fff;
    padding: 24px;
    border-radius: 8px;
    width: 520px;
    max-width: 95%;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.modal-header h2 {
    font-size: 16px;
    font-weight: 600;
}

.close-button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #858585;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    font-size: 14px;
    margin-bottom: 4px;
    font-weight: 500;
    color: #333;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #f6f6f6;
    background-color: #f6f6f6;
    font-size: 14px;
    color: #535353;
}

.modal-footer {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 24px;
}

.cancel-button {
    background-color: #4AA19D;
    color: white;
    padding: 10px 48px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    width: 225px;
}

.add-user-button {
    background-color: #3C6E6C;
    color: white;
    padding: 10px 48px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    width: 225px;
}
</style>

