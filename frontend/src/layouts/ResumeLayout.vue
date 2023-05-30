<template>
  <q-layout view="lHh Lpr lFf"> 
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <span class="gt-sm">Curriculum Vitae</span>
          <span class="lt-md">CV</span> Leon Klute
        </q-toolbar-title>
        <resume-tabs class="desktop-only"/>
        <q-space class="desktop-only"/>
      </q-toolbar>
    </q-header>
    
    <q-footer class="mobile-only">
      <resume-tabs />
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ResumeTabs from 'src/components/ResumeTabs.vue';

export default defineComponent({
  name: 'ResumeLayout',
  components: { ResumeTabs }
})
</script>
