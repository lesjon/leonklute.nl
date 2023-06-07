<template>
  <q-responsive ratio="1" class="col" :style="`max-width: ${boardsize}vh;`">
    <div>
      <div class="row" v-for="row in processedRows" :key="row">
        <chess-square class="col" v-for="column in columns" :key="column" :row="row" :column="column"
          :selected-square="selectedSquare" :piece="game?.getPieceAt(row, column) || undefined" @click="onSquareClick"
          :highlight="possibleMoves.some(sqr => isSameLocation({ row, column }, sqr))" />
      </div>
    </div>
  </q-responsive>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { rows, columns, Square, isSameLocation, columnLetters } from './chess-board';
import ChessSquare from './ChessSquare.vue';
import ChessGame from './chess-game';

export default defineComponent({
  name: 'ChessBoard',
  components: {
    ChessSquare,
  },
  props: {
    game: {
      type: Object as PropType<ChessGame>,
    },
    flipped: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rows,
      columns,
      boardsize: 80,
      selectedSquare: undefined as Square | undefined,
      possibleMoves: [] as Square[],
    };
  },
  computed: {
    processedRows() {
      return this.flipped ? this.rows : this.rows.slice().reverse();
    },
  },
  methods: {
    isSameLocation,
    onSquareClick(square: Square) {
      if (!this.selectedSquare){
        this.selectedSquare = square;
        this.possibleMoves = this.game?.getPossibleMoves(square) || [];
        return;
      }
      if (isSameLocation(this.selectedSquare, square)) {
        // reset selected square
        this.selectedSquare = undefined;
        this.possibleMoves = [];
        return;
      }
      if(this.game?.movePieceIfLegal(this.selectedSquare, square)) {
        this.selectedSquare = undefined;
        this.possibleMoves = [];
      } else {
        this.selectedSquare = square;
        this.possibleMoves = this.game?.getPossibleMoves(square) || [];
      }
    },
  },
})
</script>
