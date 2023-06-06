<template>
  <q-page padding>
    <chess-board :game="game" :flipped="flipped" />
    <q-card>
      <q-card-actions>
        <q-btn class="q-mr-md" color="primary" label="New Game" @click="game?.newGame()" />
        <q-toggle class="q-mr-md" color="primary" label="Flip Board" v-model="flipped" />
      </q-card-actions>
      <q-card-section>
        <pre>{{ game.toFen() }}</pre>
      </q-card-section>
    </q-card>
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
      game,
      flipped: false,
    };
  },
})
</script>
