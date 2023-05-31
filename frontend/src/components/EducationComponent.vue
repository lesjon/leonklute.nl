<template>
  <q-card v-for="education in educations" :key="education['Profiel opl naam']">
    <q-card-section horizontal class="q-ma-md">
      <q-card-section class="text-h6">
        {{ education["Profiel opl naam"] }}
      </q-card-section>
      <q-space />
      <q-card-section>
        Diploma behaald: {{ education["Profiel opl diploma"] == "1" ? 'Ja' : 'Nee' }}
      </q-card-section>
      <q-card-section>
        {{ education["Profiel opl start"] }} - {{ education["Profiel opl eind"] }}
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Education {
  'Profiel opl naam': string,
  'Profiel opl start': string,
  'Profiel opl eind': string,
  'Profiel opl diploma': string
}

interface Course {
  'Value': string,
  'Profiel cur naam': string,
  'Profiel cur certificaat': string,
  'Profiel cur eind': string
}

export default defineComponent({
  data() {
    return {
      educationAndCourses: [] as (Education | Course)[],
    }
  },
  mounted() {
    this.fetchExperiences()
  },
  computed: {
    educations(): Education[] {
      return this.educationAndCourses.filter((educationAndCourse) => educationAndCourse.hasOwnProperty('Profiel opl naam')) as Education[]
    }
  },
  methods: {
    async fetchExperiences() {
      this.$api.get('/resume/files//education.json')
        .then((response) => {
          this.educationAndCourses = response.data
        })
    }
  }
});
</script>
