<template>
    <div>
        <div>
            <div class="blur" v-if="modalAddFlag" @click="modalAddFlag = false"></div>
            <div class="blur" v-if="modalEditFlag" @click="modalEditFlag = false"></div>
            <div>
                <div class="modal" v-if="modalAddFlag">
                    <div class="title">Добавление контакта</div>
                    <form class="modal_input">
                        <input type="text" v-model="name_input" @input="inputData" placeholder="Имя">
                        <input type="text" v-model="surname_input" @input="inputData" placeholder="Фамилия">
                        <input type="text" v-model="phone_input" @input="inputData" placeholder="Номер телефона">
                        <input type="text" v-model="email_input" @input="inputData" placeholder="E-mail">
                    </form>
                    <div class="footer">
                        <button class="primary" :disabled="save_disabled" @click="addContact">Сохранить</button>
                        <button class="secondary" @click="modalAddFlag = false">Отменить</button>
                    </div>
                </div>
            </div>

            <div>
                <div class="modal" v-if="modalDelFlag">
                    <div class="title">Подтвердите действие</div>
                    <div class="mutted">Вы уверены, что хотите удалить контакт?</div>
                    <div class="footer">
                        <button class="danger" @click="delContact">Удалить</button>
                        <button class="secondary" @click="modalDelFlag = false">Отменить</button>
                    </div>
                </div>
            </div>

            <div>
                <div class="modal" v-if="modalEditFlag">
                    <div class="title">Редактирование контакта</div>
                    <form class="modal_input">
                        <input type="text" v-model="name_input" placeholder="Имя">
                        <input type="text" v-model="surname_input" placeholder="Фамилия">
                        <input type="text" v-model="phone_input" placeholder="Номер телефона">
                        <input type="text" v-model="email_input" placeholder="E-mail">
                    </form>
                    <div class="footer">
                        <button class="primary">Сохранить</button>
                        <button class="secondary" @click="modalEditFlag = false">Отменить</button>
                    </div>
                </div>
            </div>
        </div>







        <div class="container">
            <div class="white">
                <div class="title">Контакты</div>
                <div class="svg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                        <path d="M10.305 1.99999V18.61" stroke="#0A84FF" stroke-width="3" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M2 10.305H18.61" stroke="#0A84FF" stroke-width="3" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </div>
            </div>

            <div class="window">
                <div>
                    <div class="search-flex">
                        <input type="text" placeholder="Поиск">
                        <button class="search-flex__center" @click="modalAddFlag = true">
                            <svg viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.305 1.695V18.305" stroke="#0A84FF" stroke-width="3" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path d="M2 10H18.61" stroke="#0A84FF" stroke-width="3" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                            Добавить контакт
                        </button>
                    </div>

                    <div class="main">
                        <div class="main-50 scroll">
                            <div v-for="(item, index) in result" :key="index">
                                <div class="main_title">{{ item.letter }}</div>
                                <router-link :to="'/' + item.id" class="main_item" v-for="(item, index) in item.users"
                                    :key="index" :class="{ 'main_item--active': item.id == $route.params.id }">
                                    {{ item.name }} {{ item.surname }}
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios'

export default {
    data() {
        return {
            users_server: [],
            user: [],
            result: [],
            id_param: this.$route.params.id,
            infoFlag: true,

            modalAddFlag: false,
            modalEditFlag: false,

            name_input: null,
            surname_input: null,
            phone_input: null,
            email_input: null,

            save_disabled: true,
        }
    },

    methods: {
        getContacts() {
            axios.get('http://127.0.0.1:8000/api/get_contacts')
                .then(response => {
                    this.users_server = response.data
                    this.displayByLetter(this.users_server)

                    for (let i in this.result) {
                        for (let j in this.result[i].users) {
                            if (this.result[i].users[j].id == this.id_param) {
                                this.user = this.result[i].users[j]
                            }
                        }
                    }
                })
        },

        addContact() {
            axios.post('http://127.0.0.1:8000/api/add_contact', {
                name: this.name_input,
                surname: this.surname_input,
                phone: this.phone_input,
                email: this.email_input
            })
                .then(response => {
                    this.modalAddFlag = false
                    this.users_server.push(response.data)
                    this.result = []
                    this.displayByLetter(this.users_server)
                })
        },

        displayByLetter(book) {
            let letters = {}
            for (let i = 0; i < book.length; i++) {
                let name = book[i].name
                let firstLetter = name.charAt(0).toUpperCase()
                if (!letters[firstLetter]) {
                    letters[firstLetter] = []
                }
                letters[firstLetter].push({
                    name: name,
                    surname: book[i].surname,
                    phone: book[i].phone,
                    email: book[i].email,
                    id: book[i].id,
                })
            }

            for (let letter in letters) {
                this.result.push({
                    letter: letter,
                    users: letters[letter]
                })
            }
        },

        inputData() {
            if (this.name_input && this.surname_input && this.phone_input && this.email_input)
                this.save_disabled = false
            else this.save_disabled = true
        },
    },

    mounted() {
        this.getContacts()
    },

    watch: {
        $route(to) {
            this.id_param = to.params.id
            this.infoFlag = true

            for (let i in this.result) {
                for (let j in this.result[i].users) {
                    if (this.result[i].users[j].id == this.id_param) {
                        this.user = this.result[i].users[j]
                    }
                }
            }
        },
        modalAddFlag() {
            this.name_input = null
            this.surname_input = null
            this.phone_input = null
            this.email_input = null
        },
        modalEditFlag() {
            this.name_input = null
            this.surname_input = null
            this.phone_input = null
            this.email_input = null
        }
    },
}
</script>
