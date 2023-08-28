<template>
  <q-img :src="image" style="height: inherit;" fit="scale-down"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import image from 'assets/1693210531750.jpg';

export default defineComponent({
  name: 'PhotoReel',
  data() {

    return {
      image,

    }
  }
});
</script>
