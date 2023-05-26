<template>
  <q-card>
    <q-card-section>
      <div v-if="motivations.length > 0">{{ motivations[0]["Comment"] }}</div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const BUCKET_URL = 'https://s3.eu-central-1.amazonaws.com/resume.leonklute.nl'

interface Motivation {
  'Comment': string
}

export default defineComponent({
  data() {
    return {
      motivations: [] as Motivation[],
    }
  },
  mounted() {
    this.fetchExperiences()
  },
  methods: {
    async fetchExperiences() {
      this.$axios.get(`${BUCKET_URL}/motivation.json`)
        .then((response) => {
          this.motivations = response.data
        })
    }
  }
})
</script>
