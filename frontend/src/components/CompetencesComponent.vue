<template>
  <q-table :rows="competences" :columns="COLUMNS" title="Competenties" :rows-per-page-options="[0]" hide-pagination
    hide-header :loading="loading"/>
</template>

<script lang="ts">
import { QTableColumn } from 'quasar';
import { defineComponent } from 'vue';
import { Level, LevelFormatter, LevelToOrdinal } from './models';

interface Competence {
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
  name: 'CompetencesComponent',
  data: () => {
    return {
      competences: [] as Competence[],
      COLUMNS
    }
  },
  mounted() {
    this.fetchTechnologies()
  },
  computed: {
    loading() {
      return this.competences.length === 0;
    }
  },
  methods: {
    async fetchTechnologies() {
      this.competences = [];
      this.$api.get('/resume/files/competences.json')
        .then((response) => {
          this.competences.push(...(response.data as Competence[]))
          this.competences.sort((a, b) => {
            const aIndex = LevelToOrdinal(a['Level ( J / M / S / E )']);
            const bIndex = LevelToOrdinal(b['Level ( J / M / S / E )']);
            return bIndex - aIndex;
          })
        })
    }
  }
})
</script>