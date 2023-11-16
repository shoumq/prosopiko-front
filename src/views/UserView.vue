<template>
    <div>
        <div>
            <div class="blur" v-if="modalAddFlag" @click="modalAddFlag = false"></div>
            <div class="blur" v-if="modalDelFlag" @click="modalDelFlag = false"></div>
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
                        <button class="primary"
                            @click="editContact(name_input, surname_input, phone_input, email_input)">Сохранить</button>
                        <button class="secondary" @click="modalEditFlag = false">Отменить</button>
                    </div>
                </div>
            </div>
        </div>







        <div class="container">
            <div class="title mob_none">Контакты</div>


            <div class="pc_none search-flex jus_bet">
                <router-link to="/" class="jus_bet--back">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="21" viewBox="0 0 12 21" fill="none">
                            <path
                                d="M9.60938 20.3906C9.86719 20.6484 10.1953 20.7891 10.582 20.7891C11.3555 20.7891 11.9766 20.1797 11.9766 19.4062C11.9766 19.0195 11.8125 18.668 11.543 18.3984L3.33984 10.3828L11.543 2.39062C11.8125 2.12109 11.9766 1.75781 11.9766 1.38281C11.9766 0.609375 11.3555 0 10.582 0C10.1953 0 9.86719 0.140625 9.60938 0.398438L0.492188 9.30469C0.164062 9.60938 0.0117188 9.98438 0 10.3945C0 10.8047 0.164062 11.1562 0.492188 11.4727L9.60938 20.3906Z"
                                fill="#0A84FF" />
                        </svg>
                    </div>
                    Контакты
                </router-link>
                <div class="save pc_none" v-if="this.$route.path === '/new'" @click="addContact">Сохранить</div>
                <div class="save pc_none" v-else @click="editContact(user.name, user.surname, user.phone, user.email)">
                    Сохранить</div>
            </div>

            <div class="window">
                <div>
                    <div class="search-flex mob_none">
                        <form @submit.prevent="search">
                            <input spellcheck="false" type="text" placeholder="Поиск" v-model="search_data">
                        </form>
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
                        <div class="main-50 scroll mob_none">
                            <div v-for="(item, index) in result" :key="index">
                                <div class="main_title">{{ item.letter }}</div>
                                <router-link :to="'/' + item.id" class="main_item" v-for="(item, index) in item.users"
                                    :key="index" :class="{ 'main_item--active': item.id == $route.params.id }">
                                    {{ item.name }} {{ item.surname }}
                                </router-link>
                            </div>
                        </div>

                        <div class="main-50 info" v-if="infoFlag">
                            <div class="info_title mob_none">Данные о контакте</div>

                            <div class="info_column mob_none">
                                <div class="info_flex">
                                    <div class="info_key">Имя:</div>
                                    <div class="ingo_value">{{ user.name }}</div>
                                </div>

                                <div class="info_flex">
                                    <div class="info_key">Фамилия:</div>
                                    <div class="ingo_value">{{ user.surname }}</div>
                                </div>

                                <div class="info_flex">
                                    <div class="info_key">Номер телефона:</div>
                                    <div class="ingo_value">{{ user.phone }}</div>
                                </div>

                                <div class="info_flex">
                                    <div class="info_key">E-mail:</div>
                                    <div class="ingo_value">{{ user.email }}</div>
                                </div>
                            </div>


                            <div class="info_column pc_none" v-if="this.$route.path === '/new'">
                                <input class="input" type="text" placeholder="Имя" v-model="name_input">
                                <input class="input" type="text" placeholder="Фамилия" v-model="surname_input">
                                <input class="input" type="text" placeholder="Телефон" v-model="phone_input">
                                <input class="input" type="text" placeholder="Email" v-model="email_input">
                            </div>

                            <div class="info_column pc_none" v-else>
                                <input class="input" type="text" placeholder="Имя" v-model="user.name">
                                <input class="input" type="text" placeholder="Фамилия" v-model="user.surname">
                                <input class="input" type="text" placeholder="Телефон" v-model="user.phone">
                                <input class="input" type="text" placeholder="Email" v-model="user.email">
                            </div>

                            <div class="info_buttons mob_none">
                                <div class="primary" @click="modalEditFlag = true">Редактировать</div>
                                <div class="danger" @click="modalDelFlag = true">Удалить контакт</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="info_buttons pc_none">
                <div class="danger" @click="modalDelFlag = true" v-if="this.$route.path !== '/new'">Удалить контакт</div>
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
            modalDelFlag: false,
            modalEditFlag: false,

            name_input: null,
            surname_input: null,
            phone_input: null,
            email_input: null,

            save_disabled: true,

            search_data: null
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

        search() {
            if (this.search_data !== null) {
                axios.post('http://127.0.0.1:8000/api/search', {
                    body: this.search_data
                })
                    .then(response => {
                        this.users_server = response.data
                        this.result = []
                        this.displayByLetter(this.users_server)
                    })
            }
        },

        delContact() {
            axios.post('http://127.0.0.1:8000/api/del_contact', {
                id: this.$route.params.id
            })
                .then(() => {
                    this.modalDelFlag = false
                    this.result = this.result.filter(x => {
                        return x.id != this.$route.params.id;
                    })
                    this.$router.push('/')
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
                    this.$router.push('/')
                })
        },

        editContact(name, surname, phone, email) {
            axios.post('http://127.0.0.1:8000/api/edit_contact', {
                id: this.$route.params.id,
                name: name,
                surname: surname,
                phone: phone,
                email: email
            })
                .then(() => {
                    this.modalEditFlag = false
                    this.result = []
                    this.displayByLetter(this.users_server)
                    this.$router.push('/')
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
