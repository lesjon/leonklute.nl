<template>
  <div :style="`max-width: ${boardsize}vh; user-select: none`">
    <q-responsive :ratio="8 / 9" class="col">
      <div>
        <div class="row justify-between" style="position: relative;">
          <player-card class="row" :game="game" :color="flipped ? 'w' : 'b'" :size="`${boardsize / 20}vh`" />
        </div>
        <div class="row" v-for="row in processedRows" :key="row">
          <chess-square class="col" v-for="column in processedColumns" :key="column" :row="row" :column="column"
            :piece="game?.getPieceAt(row, column)" :selected-square="selectedSquare" @mousedown="onSquareMouseDown"
            @mouseup="onSquareMouseUp" :highlight="possibleMoves.some(sqr => isSameLocation({ row, column }, sqr))"
            @promotion="promotionSelection"
            :promotion-selection="promotionSquare && isSameLocation(promotionSquare, { row, column })" />
        </div>
        <div class="row justify-between" style="position: relative;">
          <player-card :game="game" :color="flipped ? 'b' : 'w'" :size="`${boardsize / 20}vh`" />
          <q-btn fab flat icon="zoom_out_map" style="position: absolute; right: -40px; top: -15px;"
            v-touch-pan.prevent.mouse="moveFab" />
        </div>
      </div>
    </q-responsive>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { columns, isSameLocation, rows, Square } from './chess-board';
import ChessGame from './chess-game';
import Move from './chess-move';
import { chessPieceFromType, ChessPieceType } from './chess-pieces';
import ChessSquare from './ChessSquare.vue';
import PlayerCard from './PlayerCard.vue';

export default defineComponent({
  name: 'ChessBoard',
  components: {
    ChessSquare, PlayerCard
  },
  props: {
    game: ChessGame,
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
      possibleMoves: [] as Square[],
      promotion: undefined as undefined | ChessPieceType,
      promotionSquare: undefined as undefined | Square,
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
    onSquareMouseDown(square: Square) {
      if (!this.selectedSquare) {
        this.selectSquareAndCalculatePossibleMoves(square);
      } else if (isSameLocation(this.selectedSquare, square)) {
        this.selectedSquare = undefined;
        this.possibleMoves = [];
        return;
      } else if (!this.possibleMoves.some(sqr => isSameLocation(sqr, square))) {
        this.selectSquareAndCalculatePossibleMoves(square);
      }
    },
    async onSquareMouseUp(square: Square) {
      if (!this.selectedSquare) {
        return;
      } else if (!this.selectedSquare.piece) {
        this.selectedSquare = square;
        return;
      }
      const game = this.game;
      const move: Move = { from: this.selectedSquare, piece: this.selectedSquare.piece, row: square.row, column: square.column, takes: square.piece ?? undefined };
      if (game?.isPromotion(move)) {
        const promotionType = await this.getPromotionType(square);
        if (!promotionType) return;
        move.promotion = chessPieceFromType(promotionType) ?? undefined;
      }
      if (game?.movePieceIfLegal(move)) {
        this.selectedSquare = undefined;
        this.possibleMoves = [];
        this.promotionSquare = undefined;
        this.promotion = undefined;
      } else {
        this.selectSquareAndCalculatePossibleMoves(square);
      }
    },
    moveFab(details: { evt: Event, delta: { x: number, y: number } }) {
      this.boardsize = Math.min(Math.max(this.boardsize + details.delta.x / 10, 20), 100);
    },
    async getPromotionType(square: Square) {
      this.promotionSquare = square;
      while (!this.promotion && this.promotionSquare && isSameLocation(this.promotionSquare, square)) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      const promotion = this.promotion;
      return promotion;
    },
    promotionSelection(type: ChessPieceType) {
      this.promotion = type;
    },
    selectSquareAndCalculatePossibleMoves(square: Square) {
      this.selectedSquare = square;
      if (!this.game) return;
      this.possibleMoves = this.game?.getPossibleMovesFor(square, this.game.turn, this.game.chessBoard, true) || [];
    },
  },
})
</script>
