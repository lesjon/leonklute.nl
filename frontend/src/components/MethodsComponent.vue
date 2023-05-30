<template>
  <q-table :rows="technologies" :columns="COLUMNS" title="Methodes" :rows-per-page-options="[0, 10, 20, 50]"/>
</template>

<script lang="ts">
import { QTableColumn } from 'quasar';
import { defineComponent } from 'vue';
import { Level, LevelFormatter } from './models';

interface Method {
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
      technologies: [] as Method[],
      COLUMNS
    }
  },
  mounted() {
    this.fetchTechnologies()
  },
  methods: {
    async fetchTechnologies() {
      this.technologies = [];
      this.$api.get(`/methods.json`)
        .then((response) => {
          this.technologies.push(...(response.data as Method[]))
        })
    }
  }
})
</script>
