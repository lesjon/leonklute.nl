<template>
  <q-page padding>
    <motivation-component />
  </q-page>
</template>

<script lang="ts">
import MotivationComponent from 'src/components/MotivationComponent.vue';
import { defineComponent } from 'vue'

export default defineComponent({
  components: { MotivationComponent }
})
</script>
