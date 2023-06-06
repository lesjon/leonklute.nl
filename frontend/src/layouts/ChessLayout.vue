<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="leftDrawer = !leftDrawer" />
        <q-toolbar-title>
          Chess
        </q-toolbar-title>

        <q-tabs>
          <q-route-tab icon="map" to="/chess/analysis" replace label="Analysis" />
          <q-route-tab icon="assignment" to="/chess/play" replace label="Play" />
        </q-tabs>
        <q-space />
      </q-toolbar>
    </q-header>


    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-drawer v-model="leftDrawer" side="left" bordered content-class="bg-grey-2">
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit q-pa-sm">
        <!-- Content here -->
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'ChessLayout',

  setup() {
    const leftDrawer = ref(false)
    return { leftDrawer }
  }
})
</script>
