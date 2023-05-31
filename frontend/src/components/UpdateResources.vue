<template>
  <q-btn label="Update" icon="cloud_sync" @click="updateResources" :loading="updating"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UpdateResources',
  data() {
    return {
      updating: false
    }
  },
  methods: {
    updateResources() {
      this.updating = true;
      this.$api.post('/resume/update')
        .then(() => {
          this.updating = false;
          this.$q.notify({
            message: 'Resources updated successfully',
            color: 'positive',
            icon: 'cloud_done'
          })
        })
        .catch(() => {
          this.updating = false;
          this.$q.notify({
            message: 'Failed to update resources',
            color: 'negative',
            icon: 'cloud_off'
          })
        }
      )
    }
  }
})
</script>
