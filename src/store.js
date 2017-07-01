import Vue from 'vue'
import Vuex from 'vuex'
import Firebase from 'firebase'
import FirebaseApp from 'firebase-app'
import {
    firebaseMutations,
    firebaseAction,
} from 'vuexfire'

Vue.use(Vuex)

function fetch(key) {
    return new Promise((resolve, reject) => {
        FirebaseApp.database().ref(key).once('value', snap => {
            const array = []
            snap.forEach(item => {
                const val = item.val()
                array.push(Object.assign({}, val, { '.key': item.key }))
            })
            resolve(array)
        })
    })
}

export function createStore() {
    return new Vuex.Store({
        state: {
            input: '',
            selectedItem: null,
            items: [],
            user: null,
        },
        getters: {
            items: state => state.items.sort((a, b) => b.created - a.created),
            selectedItemKey: state => {
                const item = state.selectedItem || {}
                return item['.key'] || null
            },
            selectedItemRef: (state, { selectedItemKey }) => FirebaseApp.database().ref('items/' + selectedItemKey)
        },
        mutations: {
            updateInput(state, raw) {
                state.input = raw
            },
            setItems(state, items) {
                state.items = items
            },
            ...firebaseMutations,
        },
        actions: {
            updateInput({ commit }, { ref, raw }) {
                return ref.update({
                    raw,
                    updated: Firebase.database.ServerValue.TIMESTAMP,
                }).then(() => {
                    commit('updateInput', raw)
                })
            },
            fetchItems({ commit }) {
                return fetch('items').then(items => {
                    commit('setItems', items)
                    return items
                })
            },
            setItemsRef: firebaseAction(({ bindFirebaseRef }, ref) => {
                bindFirebaseRef('items', ref)
            }),
            setItemRef: firebaseAction(({ state, commit, bindFirebaseRef, unbindFirebaseRef }, ref) => {
                if (state.selectItemRef) {
                    unbindFirebaseRef('selectedItem', state.selectItemRef)
                }
                bindFirebaseRef('selectedItem', ref)
            })
        },
    })
}