<template>
  <q-tabs>
    <q-route-tab icon="person" to="/resume" replace label="Persoon" />
    <q-route-tab icon="route" to="/resume/experience" label="Ervaring" />
    <q-route-tab icon="assignment" to="/resume/education" replace label="Opleidingen" />
    <q-route-tab icon="handyman" to="/resume/technology" replace label="Technologieën" />
  </q-tabs>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ResumeTabs'
})
</script>
