<template>
  <div id="app">
    <div class="nav">
      <div class="actions">
        <button @click="addItem">Add</button>
      </div>
      <div class="items">
        <ul>
          <li @click="selectItem(item)" v-for="item in items" v-bind:key="item" :class="selectedItemKey === item['.key']? 'selected': null">
            <router-link class="link" :to="'/' + item['.key']">{{item.raw | title}}</router-link>
          </li>
        </ul>
      </div>
    </div>
    <router-view class="view"></router-view>
  </div>
</template>

<script>
import Firebase from 'firebase'
import FirebaseApp from 'firebase-app'
import { mapGetters, mapActions } from 'vuex'

const db = FirebaseApp.database()
const itemsRef = db.ref('items')

export default {
  name: 'app',
  mounted() {
    return this.$store.dispatch('setItemsRef', itemsRef)
  },
  asyncData({ store }) {
    return store.dispatch('fetchItems').then((items) => {
      const id = store.state.route.params.id
      if (!id) {
        return
      }
      return this.selectItemRef(itemsRef.child(id))
    })
  },
  computed: {
    ...mapGetters([
      'items',
      'selectedItemKey',
    ]),
  },
  watch: {
    '$route'(to, from) {
      const id = to.params.id
      if (!id) {
        return
      }
      return this.selectItemRef(itemsRef.child(id))
    }
  },
  methods: {
    addItem() {
      const item = {
        raw: '',
        created: Firebase.database.ServerValue.TIMESTAMP,
        updated: Firebase.database.ServerValue.TIMESTAMP,
      }
      return itemsRef.push(item).then(() => this.selectItem(this.items[0]))
    },
    selectItem(item) {
      return this.$router.push('/' + item['.key'])
    },
    selectItemRef(ref) {
      return this.$store.dispatch('setItemRef', ref)
    }
  },
  filters: {
    title(val) {
      return val.split('\n')[0] || 'no title'
    }
  },
}

</script>

<style>
html,
body,
#app {
  height: 100%;
}

#app {
  display: flex;
}

.nav {
  flex: 1;
  overflow: scroll;
}

.view {
  flex: 4;
}

.nav ul li {
  list-style-type: none;
}

.nav ul li .link {
  color: black;
  text-decoration: none;
}

.nav ul li.selected {
  font-weight: bold;
}
</style>