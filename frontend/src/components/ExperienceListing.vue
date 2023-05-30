<template>
  <div class="text-h3 text-center q-ma-lg">Ervaring</div>
  <q-list>
    <q-item v-for="experience in filteredExperiences" :key="experience['Profiel ervaring technieken']">
      <q-item-section class="col-lg-3 col-xl-2 col-md-4 col-sm-5 col-xs-6  ">
        <q-item-label>{{ experience["Profiel ervaring functie"] }}</q-item-label>
        <q-item-label caption>{{ experience["Profiel ervaring klant"] }}</q-item-label>
        <q-item-label caption>
          {{ experience["Profiel ervaring datum vanaf"] }} - {{ experience["Profiel ervaring datum tot"] }}
        </q-item-label>
      </q-item-section>
      <q-item-section class="multiline">
        {{ experience["Profiel ervaring werkzaamheden"] }}
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Experience {
  'Value': string,
  'Profiel ervaring klant': string,
  'Profiel ervaring branche': string,
  'Profiel ervaring datum vanaf': Date,
  'Profiel ervaring datum tot': Date,
  'Profiel ervaring functie': string,
  'Show on CV': boolean,
  'Profiel ervaring methoden': string,
  'Profiel ervaring technieken': string,
  'Profiel ervaring werkzaamheden': string
}

export default defineComponent({
  name: 'ExperienceListing',
  data() {
    return {
      experiences: [] as Experience[],
    }
  },
  mounted() {
    this.fetchExperiences()
  },
  computed: {
    filteredExperiences() {
      return this.experiences.filter((experience) => experience['Show on CV'])
    }
  },
  methods: {
    async fetchExperiences() {
      this.$api.get(`/experiences.json`)
        .then((response) => {
          this.experiences = response.data
        })
    }
  }
})
</script>

<style scoped>
.multiline {
  white-space: pre-line;
}
</style>
