<template>
  <q-page padding>
    <motivation-component />
    <div class="q-mt-md text-center">
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
import { defineComponent } from 'vue';

const BUCKET_URL = 'https://s3.eu-central-1.amazonaws.com/resume.leonklute.nl'

export default defineComponent({
  components: { MotivationComponent },
  methods: {
    downloadResume() {
      window.open(BUCKET_URL + '/resume.pdf', '_blank');
    }
  }
})
</script>
