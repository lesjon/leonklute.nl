<template>
  <q-page padding class="row justify-center q-gutter-lg">
    <chess-board :game="game" :flipped="flipped" class="col-12" />
    <q-card style="max-width: 90vw; width: 90ch;">
      <q-card-actions>
        <q-btn class="q-mr-md" color="primary" label="New Game" @click="game?.newGame()" />
        <q-toggle class="q-mr-md" color="primary" label="Flip Board" v-model="flipped" />
      </q-card-actions>
      <q-card-section @click="copyFen">
        <q-input outlined readonly dense :model-value="game.toFen()" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { copyToClipboard } from 'quasar';
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
  methods: {
    copyFen() {
      copyToClipboard(this.game.toFen()).then(() => {
        this.$q.notify({
          message: 'FEN copied to clipboard',
          color: 'positive',
        })
      }).catch(() => {
        this.$q.notify({
          message: 'Failed to copy FEN to clipboard',
          color: 'negative',
        });
      })
    },
  },
})
</script>
