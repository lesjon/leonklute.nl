<template>
  <q-page padding>
    <education-component />
  </q-page>
</template>

<script lang="ts">
import EducationComponent from 'src/components/EducationComponent.vue';
import { defineComponent } from 'vue'
export default defineComponent({
  components: { EducationComponent }
})
</script>
