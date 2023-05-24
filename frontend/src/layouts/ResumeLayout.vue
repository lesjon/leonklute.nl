<template>
  <q-layout view="lHh Lpr lFf"> 
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Curriculum Vitae Leon Klute
        </q-toolbar-title>
        <q-tabs>
          <q-route-tab icon="person" to="/resume" replace label="Persoon" />
          <q-route-tab icon="route" to="/resume/experience" label="Ervaring" />
          <q-route-tab icon="assignment" to="/resume/education" replace label="Opleidingen" />
          <q-route-tab icon="handyman" to="/resume/education" replace label="Technologieën" />
        </q-tabs>
        <q-space/>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ResumeLayout'
})
</script>
