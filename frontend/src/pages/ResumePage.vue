<template>
  <q-page padding class="flex items-stretch q-gutter-md">
    <motivation-component class="row"/>
    <photo-reel class="col fit" />
    <competences-component class="col" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MotivationComponent from 'src/components/MotivationComponent.vue';
import CompetencesComponent from 'src/components/CompetencesComponent.vue';
import PhotoReel from 'src/components/PhotoReel.vue';

export default defineComponent({
  components: { MotivationComponent, CompetencesComponent, PhotoReel },
  methods: {
    downloadResume() {
      const resumeUri = this.$api.getUri({ url: '/resume.pdf' });
      window.open(resumeUri, '_blank');
    }
  }
})
</script>
