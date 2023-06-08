<template>
  <q-table :rows="courses" :columns="COLUMNS" title="Cursussen" :rows-per-page-options="[0]" hide-pagination/>
</template>

<script lang="ts">
import { QTableColumn } from 'quasar';
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



const sortByCompleted = (a: Course, b: Course) => {
  return b['Profiel cur eind'].localeCompare(a['Profiel cur eind']);
}

const COLUMNS: QTableColumn[] = [
  {
    name: 'Profiel cur naam',
    label: 'Cursus',
    field: 'Profiel cur naam',
    align: 'left',
    sortable: true
  },
  {
    name: 'Profiel cur certificaat',
    label: 'Certificaat',
    field: 'Profiel cur certificaat',
    align: 'left',
    sortable: true,
    format: (value: string) => value === '1' ? 'Behaald' : value === '0' ? 'Nee' : 'N/A'
  },
  {
    name: 'Profiel cur eind',
    label: 'Afgerond',
    field: 'Profiel cur eind',
    align: 'right',
    sortable: true
  }
]

export default defineComponent({
  data() {
    return {
      educationAndCourses: [] as (Education | Course)[],
      COLUMNS
    }
  },
  mounted() {
    this.fetchExperiences()
  },
  computed: {
    courses(): Course[] {
      const courses = this.educationAndCourses.filter((educationAndCourse) => educationAndCourse.hasOwnProperty('Profiel cur naam')) as Course[];
      const sortedCourses = courses.sort(sortByCompleted);
      console.log(sortedCourses);
      return sortedCourses;
    }
  },
  methods: {
    async fetchExperiences() {
      this.$api.get('/resume/files/education.json')
        .then((response) => {
          this.educationAndCourses = response.data
        })
    }
  }
});
</script>
