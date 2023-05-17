<template>
  <q-img :src="image" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import image from 'assets/selfie.jpeg';

export default defineComponent({
  name: 'PhotoReel',
  data() {
    return {
      image
    }
  }
});
</script>
