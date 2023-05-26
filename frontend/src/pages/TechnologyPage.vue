<template>
  <q-page padding>
    <methods-component />
    <technology-component />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MethodsComponent from 'src/components/MethodsComponent.vue';
import TechnologyComponent from 'src/components/TechnologyComponent.vue';

export default defineComponent({
  components: { MethodsComponent, TechnologyComponent }
})
</script>
