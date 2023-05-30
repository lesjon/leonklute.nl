<template>
  <q-card>
    <q-card-section>
      <div class="text-body1" v-if="motivations.length > 0">{{ motivations[0]["Comment"] }}</div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
      this.$api.get('/motivation.json')
        .then((response) => {
          this.motivations = response.data
        })
    }
  }
})
</script>
