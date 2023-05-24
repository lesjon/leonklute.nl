<template>
  <q-page padding>
    <motivation-component />
    <methods-component />
  </q-page>
</template>

<script lang="ts">
import MethodsComponent from 'src/components/MethodsComponent.vue';
import MotivationComponent from 'src/components/MotivationComponent.vue';
import { defineComponent } from 'vue'
export default defineComponent({
    components: { MethodsComponent, MotivationComponent }
})
</script>
