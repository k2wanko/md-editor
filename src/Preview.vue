<template>
    <div v-html="compiledMarkdown">
    </div>
</template>

<script>
import marked from 'marked'

export default {
    name: 'preview',
    props: ['raw'],

    computed: {
        compiledMarkdown() {
            return marked(this.raw, { sanitize: true })
        },
    },
}
</script>