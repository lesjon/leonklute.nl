<template>
  <q-btn color="primary" label="PDF" icon="get_app" @click="downloadResume"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DownloadButton',
  methods: {
    downloadResume() {
      const resumeUri = this.$api.getUri({ url: '/resume.pdf' });
      window.open(resumeUri, '_blank');
    }
  }
})
</script>
