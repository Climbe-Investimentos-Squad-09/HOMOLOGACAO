<template>
    <nav-bar/>
    <table>
        <thead>
            <tr>
                <th>Nome Completo</th>
                <th>E-mail</th>
                <th>Ação</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="dado in dados" :key="dado.id">
                <td>{{ dado.fullName }}</td>
                <td>{{ dado.email }}</td>
                <td>
                    <button>Aprovar</button>
                    <button>Rejeitar</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import NavBar from '../Nav/NavBar.vue'
export default {
    components: {NavBar},
    data() {
        return {
            dados: []
        }
    },
    methods: {
        async getPending() {
            try {
                const res = await fetch('http://localhost:3000/api/auth/pending')
                const json = await res.json()
                this.dados = json
                console.log(this.dados)
            } catch(err) {
                console.error(err)
            }
        }
    },
    mounted() {
        this.getPending()
    }
}
</script>