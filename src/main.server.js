import { createApp } from './app'

const isDev = process.env.NODE_ENV !== 'production'

export default context => new Promise((resolve, reject) => {
    const { app, router, store } = createApp()
    const { url } = context

    router.push(url)

    router.onReady(() => {
        const matchedComponents = router.getMatchedComponents()
        if (!matchedComponents.length) {
            reject({ code: 404 })
        }
        app.$options.asyncData.bind(app)({ store }).then(() => {
            return Promise.all(matchedComponents.map(({ asyncData }) => asyncData && asyncData({
                store,
                route: router.currentRoute
            })))
        }).then(() => {
            context.state = store.state
            resolve(app)
        }).catch(reject)
    }, reject)
})