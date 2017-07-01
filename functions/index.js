const functions = require('firebase-functions')

const fs = require('fs')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')
const resolve = file => path.resolve(__dirname, file)
const template = fs.readFileSync(resolve('./dist/index.template.html'), 'utf-8')

function createRenderer(bundle, options) {
    return createBundleRenderer(bundle, Object.assign(options, {
        template,
        // cache: LRU({
        //     max: 1000,
        //     maxAge: 1000 * 60 * 15
        // }),
        basedir: resolve('./dist'),
        runInNewContext: false
    }))
}


const bundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./public/vue-ssr-client-manifest.json')
const renderer = createRenderer(bundle, {
    clientManifest
})

exports.index = functions.https.onRequest((req, res) => {
    const context = {
        url: req.url
    }
    renderer.renderToString(context, (err, html) => {
        const handleError = err => {
            if (err.url) {
                res.redirect(err.url)
            } else if (err.code === 404) {
                res.status(404).end('404 | Page Not Found')
            } else {
                res.status(500).end('500 | Internal Server Error')
                console.error(`error during render : ${req.url}`)
                console.error(err.stack)
            }
        }
        if (err) {
            return handleError(err)
        }
        res.end(html)
    })
})
