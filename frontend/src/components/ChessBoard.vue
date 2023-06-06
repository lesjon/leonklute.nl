<template>
  <q-responsive ratio="1" class="col" :style="`max-width: ${boardsize}vh;`">
    <div>
      <div class="row" v-for="row in rows" :key="row">
        <chess-square class="col" v-for="column in columns" :key="column"
          :row="row" :column="column" :selected-square="selectedSquare" :piece="game?.getPieceAt(row, column)"
          @click="onSquareClick"/>
      </div>
    </div>
  </q-responsive>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ChessGame, { rows, columns, Square } from './chess-game';
import ChessSquare from './ChessSquare.vue';


export default defineComponent({
  name: 'ChessBoard',
  components: {
    ChessSquare,
  },
  props: {
    game: {
      type: Object as PropType<ChessGame>,
    },
  },
  data() {
    return {
      rows,
      columns,
      boardsize: 80,
      selectedSquare: undefined as Square | undefined,
    };
  },
  methods: {
    onSquareClick(row: number, column: number, piece?: string) {
      const toSquare = {row, column, piece};
      if (!toSquare.piece && this.selectedSquare?.piece) {
        console.log('move', this.selectedSquare, toSquare);
        this.game?.movePiece(this.selectedSquare, toSquare);
        this.selectedSquare = undefined;
        return;
      }
      console.log('select', toSquare);
      this.selectedSquare = toSquare;
    },
  },
})
</script>
