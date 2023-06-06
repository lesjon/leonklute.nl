<template>
  <q-responsive ratio="1" class="col" :style="`max-width: ${boardsize}vh;`">
    <div>
      <div class="row" v-for="row in rows.slice().reverse()" :key="row">
        <chess-square class="col" v-for="column in columns" :key="column" :row="row" :column="column"
          :selected-square="selectedSquare" :piece="game?.getPieceAt(row, column) || undefined" @click="onSquareClick"
          :highlight="possibleMoves.some(sqr => isSameLocation({ row, column }, sqr))" />
      </div>
    </div>
  </q-responsive>
  <q-btn class="q-mt-md" color="primary" label="New Game" @click="game?.newGame()" />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { rows, columns, Square, isSameLocation, columnLetters } from './chess-board';
import ChessSquare from './ChessSquare.vue';
import ChessGame, { EnPassant } from './chess-game';
import { ChessPiece, FENpieces } from './chess-pieces';

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
      possibleMoves: [] as Square[],
    };
  },
  methods: {
    isSameLocation,
    onSquareClick(row: number, column: number, piece: ChessPiece | undefined) {
      console.log(`Clicked on square ${columnLetters[column]}, ${row}`);
      const enPassant = new EnPassant(this.game?.enPassant || '-');
      if (this.selectedSquare) {
        const toSquare = { row, column, pieceFen: piece };
        if (this.game?.movePieceIfLegal(this.selectedSquare, toSquare, enPassant)) {
          this.selectedSquare = undefined;
          this.possibleMoves = [];
          return;
        }
      }
      this.selectedSquare = { row, column, piece };
      if (piece) {
        this.possibleMoves = this.game?.getPieceAt(row, column)?.getPossibleMoves({ row, column, piece }, enPassant) || [];
      } else {
        this.possibleMoves = [];
      }
    },
  },
})
</script>
