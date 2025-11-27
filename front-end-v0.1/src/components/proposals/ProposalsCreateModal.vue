<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>Criar proposta comercial:</h2>
                <button class="close-button" @click="$emit('close')">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="company-name">Nome da empresa:</label>
                    <select id="company-name" v-model="formData.idEmpresa" :disabled="loading">
                        <option :value="null" disabled>Selecione uma empresa</option>
                        <option v-for="company in companies" :key="company.idEmpresa" :value="company.idEmpresa">
                            {{ company.nomeFantasia }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="proposal-value">Valor (R$):</label>
                    <input type="number" id="proposal-value" v-model.number="formData.valorProposta" step="0.01" min="0" :disabled="loading" />
                </div>

                <div class="form-group">
                    <label for="valid-until">Válido até:</label>
                    <input type="date" id="valid-until" v-model="formData.prazoValidade" :disabled="loading" />
                </div>

                <div class="form-group">
                    <label for="responsible">Responsável:</label>
                    <select id="responsible" v-model="formData.idEmissor" :disabled="loading">
                        <option :value="null" disabled>Selecione um responsável pela tarefa</option>
                        <option v-for="user in users" :key="user.idUsuario" :value="user.idUsuario">
                            {{ user.nomeCompleto }}
                        </option>
                    </select>
                </div>

                <div class="form-group file-upload">
                    <div class="upload-icon"><svg width="18" height="20" viewBox="0 0 18 20" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M5 7V9H2V18H16V9H13V7H16C16.5304 7 17.0391 7.21072 17.4142 7.58579C17.7893 7.96086 18 8.46957 18 9V18C18 18.5304 17.7893 19.0391 17.4142 19.4142C17.0391 19.7893 16.5304 20 16 20H2C1.46957 20 0.960859 19.7893 0.585786 19.4142C0.210714 19.0391 0 18.5304 0 18V9C0 8.46957 0.210714 7.96086 0.585786 7.58579C0.960859 7.21072 1.46957 7 2 7H5ZM9.884 0.469005L13.243 3.827C13.4306 4.01465 13.5361 4.26914 13.5361 4.5345C13.5361 4.79987 13.4306 5.05436 13.243 5.242C13.0554 5.42965 12.8009 5.53506 12.5355 5.53506C12.2701 5.53506 12.0156 5.42965 11.828 5.242L10 3.413V13C10 13.2652 9.89464 13.5196 9.70711 13.7071C9.51957 13.8946 9.26522 14 9 14C8.73478 14 8.48043 13.8946 8.29289 13.7071C8.10536 13.5196 8 13.2652 8 13V3.413L6.172 5.242C6.07909 5.33492 5.96879 5.40862 5.8474 5.4589C5.726 5.50918 5.5959 5.53506 5.4645 5.53506C5.33311 5.53506 5.203 5.50918 5.0816 5.4589C4.96021 5.40862 4.84991 5.33492 4.757 5.242C4.66409 5.14909 4.59039 5.03879 4.54011 4.9174C4.48982 4.79601 4.46394 4.6659 4.46394 4.5345C4.46394 4.40311 4.48982 4.273 4.54011 4.15161C4.59039 4.03022 4.66409 3.91992 4.757 3.827L8.117 0.469005C8.35139 0.234819 8.66917 0.103271 9.0005 0.103271C9.33183 0.103271 9.64961 0.234819 9.884 0.469005Z"
                                fill="#858585" />
                        </svg>
                    </div>
                    <p v-if="!selectedFile">Adicione arquivo com a proposta ou arraste-o aqui</p>
                    <div v-else class="selected-file-info fade-in">
                        <p>{{ selectedFile.name }}</p>
                        <button @click="removeSelectedFile" class="remove-file-button">Remover</button>
                    </div>
                    <p class="hint">Formatos aceitos: PDF</p>
                    <input type="file" ref="fileInput" style="display: none;" @change="handleFileChange" accept=".pdf" />
                    <button class="add-file-button" @click="triggerFileInput">Adicione arquivo</button>
                </div>
            </div>

            <div class="modal-footer">
                <button class="cancel-button" @click="$emit('close')" :disabled="loading">Cancelar</button>
                <button class="create-button" @click="handleCreate" :disabled="loading || !isFormValid">
                    {{ loading ? 'Criando...' : 'Criar proposta' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, computed } from 'vue';
import { getCompanies } from '@/api/companies';
import { getUsers } from '@/api/users';
import { createProposal } from '@/api/proposals';
import { StatusProposta } from '@/api/types';
import { useToast } from '@/composables/useToast';

const emit = defineEmits(['close', 'created']);

const alertModal = inject('alertModal', null);
const toast = useToast();
const fileInput = ref(null);
const selectedFile = ref(null);
const loading = ref(false);
const companies = ref([]);
const users = ref([]);

const formData = ref({
    idEmpresa: null,
    idEmissor: null,
    valorProposta: 0,
    prazoValidade: '',
});

const isFormValid = computed(() => {
    return formData.value.idEmpresa && 
           formData.value.idEmissor && 
           formData.value.valorProposta > 0 && 
           formData.value.prazoValidade;
});

onMounted(async () => {
    try {
        const [companiesData, usersData] = await Promise.all([
            getCompanies(),
            getUsers()
        ]);
        companies.value = companiesData;
        users.value = usersData;
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        if (alertModal) {
            alertModal.openAlert({
                title: 'Erro',
                message: 'Não foi possível carregar empresas ou usuários.',
                type: 'error'
            });
        }
    }
});

const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        selectedFile.value = file;
    } else {
        if (alertModal) {
          alertModal.openAlert({
            title: 'Formato inválido',
            message: 'Por favor, selecione um arquivo PDF.',
            type: 'warning'
          })
        }
        selectedFile.value = null;
        if (fileInput.value) {
            fileInput.value.value = '';
        }
    }
};

const removeSelectedFile = () => {
    selectedFile.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const handleCreate = async () => {
    if (!isFormValid.value) {
        if (alertModal) {
            alertModal.openAlert({
                title: 'Campos obrigatórios',
                message: 'Por favor, preencha todos os campos obrigatórios.',
                type: 'warning'
            });
        }
        return;
    }

    loading.value = true;
    try {
        const proposalData = {
            idEmpresa: formData.value.idEmpresa,
            idEmissor: formData.value.idEmissor,
            valorProposta: formData.value.valorProposta,
            prazoValidade: formData.value.prazoValidade,
            statusProposta: StatusProposta.EM_ANALISE
        };

        await createProposal(proposalData);
        
        toast.showToast('Proposta criada com sucesso!', 'success');
        emit('created');
        emit('close');
    } catch (error) {
        console.error('Erro ao criar proposta:', error);
        if (alertModal) {
            alertModal.openAlert({
                title: 'Erro',
                message: error.response?.data?.message || 'Não foi possível criar a proposta.',
                type: 'error'
            });
        }
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    backdrop-filter: blur(2px);
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
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    font-size: 14px;
    margin-bottom: 4px;
    font-weight: 500;
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

.date-group {
    display: flex;
    gap: 24px;
}

.date-input {
    width: 227px;
}

.file-upload {
    border: 1px dashed #ccc;
    border-radius: 6px;
    padding: 20px;
    text-align: center;
    background-color: #F6F6F6;
    color: #747474;
}

.upload-icon {
    font-size: 22px;
    margin-bottom: 6px;
}

.file-upload .hint {
    font-size: 12px;
    color: #BEBEBE;
}

.add-file-button {
    margin-top: 10px;
    background-color: white;
    border: 1px solid #DADADA;
    padding: 10px 48px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    color: black;
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
    padding: 4px 48px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    width: 225px;
}

.create-button {
    background-color: #3C6E6C;
    color: white;
    padding: 10px 48px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    width: 225px;
}

.selected-file-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #e9e9e9;
    border-radius: 4px;
    margin-top: 10px;
}

.selected-file-info p {
    margin: 0;
    font-size: 14px;
    color: #333;
}

.remove-file-button {
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>