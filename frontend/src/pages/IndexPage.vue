<template>
  <q-page class="row items-center justify-evenly">
    <photo-reel />
  </q-page>
</template>

<script lang="ts">
import PhotoReel from 'components/PhotoReel.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: { PhotoReel }
});
</script>
