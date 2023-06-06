<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Leon Klute
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <essential-link v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EssentialLink from '../components/EssentialLink.vue';

const essentialLinks = [
  {
    title: 'Github Repository',
    icon: 'code',
    link: 'https://github.com/lesjon/leonklute.nl'
  },
  {
    title: 'Resume',
    icon: 'local_library',
    link: '/#/resume'
  },
  {
    title: 'Caesar Experts',
    icon: 'apartment',
    link: 'https://caesarexperts.nl/'
  },
  {
    title: 'LinkedIn',
    icon: 'groups',
    link: 'https://www.linkedin.com/in/leon-klute-814892167'
  },
  {
    title: 'Chess',
    icon: 'groups',
    link: 'https://www.leonklute.nl/chess'
  }
]

export default defineComponent({
  name: 'MainLayout',
  components: {
    EssentialLink
  },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks
    }
  },

  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  }
});
</script>
