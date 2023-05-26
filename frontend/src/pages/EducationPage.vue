<template>
  <q-page padding>
    <education-component />
    <courses-component />
  </q-page>
</template>

<script lang="ts">
import CoursesComponent from 'src/components/CoursesComponent.vue';
import EducationComponent from 'src/components/EducationComponent.vue';
import { defineComponent } from 'vue'
export default defineComponent({
  components: { EducationComponent, CoursesComponent }
})
</script>
