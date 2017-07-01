import Vue from 'vue'
import App from './App.vue'
import { sync } from 'vuex-router-sync'

import { createStore } from './store'
import { createRouter } from './router'

export function createApp() {
    const store = createStore()
    const router = createRouter()

    sync(store, router)

    const app = new Vue({
      router,
      store,
      ...App,
    })

    return { app, router, store }
  }
