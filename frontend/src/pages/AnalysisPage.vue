<template>
  <q-page padding class="row justify-center q-gutter-xl">
    <chess-board :game="game" :flipped="flipped" class="col-12"/>
    <chess-controls :game="game" @flip="flipped = !flipped" style="max-width: 90vw;" @new-game="newGame"/>
  </q-page>
</template>

<script lang="ts">
import ChessBoard from 'src/components/ChessBoard.vue';
import ChessControls from 'src/components/ChessControls.vue';
import ChessGame from 'src/components/chess-game';
import Fen from 'src/components/fen';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AnalysisPage',
  components: {
    ChessBoard, ChessControls
  },
  data() {
    const game: ChessGame = Fen.gameFromStartPosition();
    return {
      game,
      flipped: false,
    };
  },
  methods: {    
    newGame() {
      this.game = Fen.fenParser(Fen.start_position_fen);
    },
  }
})
</script>
