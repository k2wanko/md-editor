<template>
    <div class="itemv-view">
        <textarea class="editor" v-model="input" :disabled="!canEdit" spellcheck="false">{{input}}</textarea>
        <preview class="preview" :raw="input"></preview>
    </div>
</template>


<script>
import Preview from './Preview.vue'
export default {
  name: 'item-view',
  components: {
    Preview,
  },
  computed: {
    canEdit() {
      return !!this.$store.state.selectedItem
    },
    input: {
      get() {
        if (!this.$store.state.selectedItem) {
          return ''
        }
        return this.$store.state.selectedItem.raw
      },
      set(raw) {
        this.$store.dispatch('updateInput', { ref: this.$store.getters.selectedItemRef, raw })
      }
    }
  },
}
</script>

<style>
.itemv-view {
    display: flex;
}

.editor,
.preview {
    flex: 1;
}

.preview {
    padding: 1%;
    overflow: scroll;
}
</style>
