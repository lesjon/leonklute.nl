<template>
  <q-table :rows="technologies" :columns="COLUMNS" title="Technologieën" />
</template>

<script lang="ts">
import { QTableColumn } from 'quasar';
import { defineComponent } from 'vue';
import { Level } from './models';

const BUCKET_URL = 'https://s3.eu-central-1.amazonaws.com/resume.leonklute.nl'

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
      this.$axios.get(`${BUCKET_URL}/technologies.json`)
        .then((response) => {
          this.technologies = response.data
        })
    }
  }
})
</script>
