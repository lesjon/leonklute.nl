<template>
  <q-table :rows="technologies" :columns="COLUMNS" title="Technologieën" :rows-per-page-options="[0, 10, 20, 50]"/>
</template>

<script lang="ts">
import { QTableColumn } from 'quasar';
import { defineComponent } from 'vue';
import { Level } from './models';

interface Technology {
  'Waarde': string, 
  'Level ( J / M / S / E )': Level
}

const COLUMNS: QTableColumn[] = [
  {
    name: 'name',
    label: 'Naam',
    field: 'Waarde',
    align: 'left'
  },
  {
    name: 'niveau',
    label: 'Niveau',
    field: 'Level ( J / M / S / E )',
    align: 'left',
    format: (value: Level) => {
      switch (value) {
        case Level.Junior:
          return 'Junior'
        case Level.Medior:
          return 'Medior'
        case Level.Senior:
          return 'Senior'
        case Level.Expert:
          return 'Expert'
      }
    }
  }
]

export default defineComponent({
  data: () => {
    return {
      technologies: [] as Technology[],
      COLUMNS
    }
  },
  mounted() {
    this.fetchTechnologies()
  },
  methods: {
    async fetchTechnologies() {
      this.technologies = [];
      this.$api.get(`/technologies.json`)
        .then((response) => {
          this.technologies.push(...(response.data as Technology[]))
        })
      this.$api.get(`/development.json`)
        .then((response) => {
          this.technologies.push(...(response.data as Technology[]))
        })
    }
  }
})
</script>
