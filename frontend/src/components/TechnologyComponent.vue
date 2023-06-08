<template>
  <q-table :rows="sortedTechnologies" :columns="COLUMNS" title="Technologieën" :rows-per-page-options="[0, 10, 20, 50]"/>
</template>

<script lang="ts">
import { QTableColumn } from 'quasar';
import { defineComponent } from 'vue';
import { Level, LevelFormatter, LevelToOrdinal } from './models';

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
    format: LevelFormatter
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
  computed: {
    sortedTechnologies(): Technology[] {
      return this.technologies.slice().sort((a, b) => {
        const aIndex = LevelToOrdinal(a['Level ( J / M / S / E )']);
        const bIndex = LevelToOrdinal(b['Level ( J / M / S / E )']);
        return  bIndex - aIndex;
      })
    }
  },
  methods: {
    async fetchTechnologies() {
      this.technologies = [];
      this.$api.get('/resume/files/technologies.json')
        .then((response) => {
          this.technologies.push(...(response.data as Technology[]))
        })
      this.$api.get('/resume/files/development.json')
        .then((response) => {
          this.technologies.push(...(response.data as Technology[]))
        })
    }
  }
})
</script>
