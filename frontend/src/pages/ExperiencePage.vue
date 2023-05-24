<template>
  <q-page padding>
    <experience-listing />
  </q-page>
</template>

<script lang="ts">
import ExperienceListing from 'src/components/ExperienceListing.vue';
import { defineComponent } from 'vue'
export default defineComponent({
    components: { ExperienceListing }
})
</script>
