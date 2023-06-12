<template>
  <div :style="`max-width: ${boardsize}vh;`">
    <q-responsive :ratio="8 / 9" class="col">
      <div>
        <player-card class="row" :game="game" :color="flipped ? 'w' : 'b'" />
        <div class="row" v-for="row in processedRows" :key="row">
          <chess-square class="col" v-for="column in processedColumns" :key="column" :row="row" :column="column"
            :piece="game?.getPieceAt(row, column) || undefined" :selected-square="selectedSquare" @click="onSquareClick"
            :highlight="possibleMoves.some(sqr => isSameLocation({ row, column }, sqr))" />
        </div>
        <div class="row justify-between" style="position: relative;">
          <player-card class="row" :game="game" :color="flipped ? 'b' : 'w'" />
          <q-btn fab flat icon="zoom_out_map" style="position: absolute; right: -40px; top: -15px;"
            v-touch-pan.prevent.mouse="moveFab" />
        </div>
      </div>
    </q-responsive>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { rows, columns, Square, isSameLocation } from './chess-board';
import ChessSquare from './ChessSquare.vue';
import ChessGame from './chess-game';
import PlayerCard from './PlayerCard.vue';
import { ChessPieceType } from './chess-pieces';

export default defineComponent({
  name: 'ChessBoard',
  components: {
    ChessSquare, PlayerCard
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
      boardsize: 60,
      selectedSquare: undefined as Square | undefined,
      possibleMoves: [] as Square[]
    };
  },
  computed: {
    processedRows() {
      return this.flipped ? this.rows : this.rows.slice().reverse();
    },
    processedColumns() {
      return this.flipped ? this.columns.slice().reverse() : this.columns;
    },
  },
  methods: {
    isSameLocation,
    onSquareClick(square: Square) {
      const game = this.game;
      if (!this.selectedSquare) {
        this.selectedSquare = square;
        if (!game) return;
        this.possibleMoves = game?.getPossibleMovesFor(square, game.turn, game.chessBoard, true) || [];
        return;
      }
      if (isSameLocation(this.selectedSquare, square)) {
        // reset selected square
        this.selectedSquare = undefined;
        this.possibleMoves = [];
        return;
      }
      const isPromotionRow = square.row === rows[0] || square.row === rows.at(-1);
      if (this.selectedSquare.piece?.toFen().toUpperCase() === 'P' && isPromotionRow) {
        if (!game) return;
        game.setPromotion(game.turn === 'w' ? ChessPieceType.whiteQueen : ChessPieceType.blackQueen);
      }
      if (game?.movePieceIfLegal(this.selectedSquare, square)) {
        this.selectedSquare = undefined;
        this.possibleMoves = [];
      } else {
        this.selectedSquare = square;
        if (!game) return;
        this.possibleMoves = game?.getPossibleMovesFor(square, game.turn, game.chessBoard, true) || [];
      }
    },
    moveFab(details: { evt: Event, delta: { x: number, y: number } }) {
      this.boardsize = Math.min(Math.max(this.boardsize + details.delta.x / 10, 20), 100);
    },
  },
})
</script>
