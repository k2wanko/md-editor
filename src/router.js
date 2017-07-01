import Vue from 'vue'
import Router from 'vue-router'

const ItemView = () => import('./ItemView.vue')

Vue.use(Router)

export function createRouter() {
    return new Router({
        mode: 'history',
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            { path: '/:id([A-Za-z0-9_-]+)?', component: ItemView },
        ],
    })
}