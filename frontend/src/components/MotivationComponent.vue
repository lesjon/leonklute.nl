<template>
  <q-card>
    <q-card-section>
      <div class="text-body1 " v-if="motivations.length > 0">{{ motivations[0]["Comment"] }}</div>
      <q-skeleton v-else type="text" style="color: transparent" class="text-body1">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </q-skeleton>
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
      this.$api.get('/resume/files/motivation.json')
        .then((response) => {
          this.motivations = response.data
        })
    }
  }
})
</script>
