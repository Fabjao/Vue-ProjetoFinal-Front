<template>
  <RecordsList />
</template>

<script>
import RecordsList from './../components/RecordsList.vue'
import { mapActions } from 'vuex'

export default {
  name: 'RecordsHome',
  components: {
    RecordsList
  },
  created() {
    this.setTitle({ title : 'Lançamento'})
  },
  methods: {
    ...mapActions(['setTitle'])
  }
}
</script>
