<template>
  <q-page padding>
    <motivation-component />
    <div class="q-mt-md">
      <q-btn
        color="primary"
        label="Download Resume"
        icon="get_app"
        @click="downloadResume"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import MotivationComponent from 'src/components/MotivationComponent.vue';
import { defineComponent } from 'vue'

export default defineComponent({
  components: { MotivationComponent },
  methods: {
    downloadResume() {
      window.open('/resume.pdf', '_blank');
    }
  }
})
</script>
