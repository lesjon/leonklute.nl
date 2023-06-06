<template>
  <q-page padding>
    <chess-board :game="game" />
    <pre>{{ game.toFen() }}</pre>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChessBoard from 'src/components/ChessBoard.vue';
import ChessGame from 'src/components/chess-game';

export default defineComponent({
  name: 'AnalysisPage',
  components: {
    ChessBoard,
  },
  data() {
    const game = new ChessGame();
    return {
      game
    };
  },
})
</script>
