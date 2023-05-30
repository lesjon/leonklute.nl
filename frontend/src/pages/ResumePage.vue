<template>
  <q-page padding class="q-gutter-md">
    <motivation-component />
    <competences-component />
    <div class="text-center">
      <q-btn
        color="primary"
        label="Download Resume"
        icon="get_app"
        @click="downloadResume"
        disable
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import MotivationComponent from 'src/components/MotivationComponent.vue';
import CompetencesComponent from 'src/components/CompetencesComponent.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { MotivationComponent, CompetencesComponent },
  methods: {
    downloadResume() {
      const resumeUri = this.$api.getUri({ url: '/resume.pdf' });
      window.open(resumeUri, '_blank');
    }
  }
})
</script>
