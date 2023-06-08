<template>
  <q-page padding class="row justify-center q-gutter-lg">
    <chess-board :game="game" :flipped="flipped" class="col-12"/>
    <chess-controls :game="game" @flip="flipped = !flipped" style="max-width: 90vw;" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChessControls from 'src/components/ChessControls.vue';
import ChessBoard from 'src/components/ChessBoard.vue';
import ChessGame from 'src/components/chess-game';

export default defineComponent({
  name: 'AnalysisPage',
  components: {
    ChessBoard, ChessControls
  },
  data() {
    const game = new ChessGame();
    return {
      game,
      flipped: false,
    };
  }
})
</script>
