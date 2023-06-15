<template>
  <q-responsive ratio="1">
    <div :style="style" style="display: grid;" @mousedown="onMouseDown" @mouseup="onMouseUp">
      <q-img loading="eager" no-transition :src="pieceImageFilename" v-if="piece" class="on-square" no-spinner/>
      <div class="highlight on-square" v-if="highlight" style="grid-column: 1; grid-row: 1;"></div>
      <div class="dot on-square" v-if="selected" style="grid-column: 1; grid-row: 1;"></div>
      <span class="on-square">{{ columnLetters[column] }}{{ row }}</span>
      <promotion-picker v-if="promotionSelection" :player-color="row === rows[0] ? 'b' : 'w'" @select="type => $emit('promotion', type)" style="grid-column: 1; grid-row: 1;" />
    </div>
  </q-responsive>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Square, columnLetters, rows } from './chess-board';
import ChessPiece, { ChessPieceType } from './chess-pieces';
import PromotionPicker from './PromotionPicker.vue';

import blackBishop from 'assets/pieces/bishop_black.png';
import blackKnight from 'assets/pieces/knight_black.png';
import blackRook from 'assets/pieces/rook_black.png';
import blackKing from 'assets/pieces/king_black.png';
import blackQueen from 'assets/pieces/queen_black.png';
import blackPawn from 'assets/pieces/pawn_black.png';
import whiteBishop from 'assets/pieces/bishop_white.png';
import whiteKnight from 'assets/pieces/knight_white.png';
import whiteRook from 'assets/pieces/rook_white.png';
import whiteKing from 'assets/pieces/king_white.png';
import whiteQueen from 'assets/pieces/queen_white.png';
import whitePawn from 'assets/pieces/pawn_white.png';

export default defineComponent({
    name: 'ChessSquare',
    components: { PromotionPicker },
    props: {
        row: {
            type: Number,
            required: true,
        },
        column: {
            type: Number,
            required: true,
        },
        piece: {
            type: Object as PropType<ChessPiece | null>,
            required: false,
        },
        highlight: {
            type: Boolean,
            required: false,
        },
        selectedSquare: {
            type: Object as PropType<Square | undefined>,
            required: false,
        },
        promotionSelection: {
            type: Boolean,
            required: false,
        },
    },
    emits: ['mousedown', 'mouseup', 'promotion'],
    data() {
        return {
            columnLetters,
            rows
        };
    },
    computed: {
        backgroundColor() {
            return (this.column + this.row) % 2 === 0 ? '#EFEFEF' : '#b58863';
        },
        style() {
            return `background-color:${this.backgroundColor};`;
        },
        pieceImageFilename() {
            if (!this.piece)
                return '';
            switch(this.piece.getType()) {
                case ChessPieceType.blackBishop:
                    return blackBishop;
                case ChessPieceType.blackKnight:
                    return blackKnight;
                case ChessPieceType.blackRook:
                    return blackRook;
                case ChessPieceType.blackKing:
                    return blackKing;
                case ChessPieceType.blackQueen:
                    return blackQueen;
                case ChessPieceType.blackPawn:
                    return blackPawn;
                case ChessPieceType.whiteBishop:
                    return whiteBishop;
                case ChessPieceType.whiteKnight:
                    return whiteKnight;
                case ChessPieceType.whiteRook:
                    return whiteRook;
                case ChessPieceType.whiteKing:
                    return whiteKing;
                case ChessPieceType.whiteQueen:
                    return whiteQueen;
                case ChessPieceType.whitePawn:
                    return whitePawn;
            }
            return '';
        },
        selected() {
            const selected = this.row === this.selectedSquare?.row && this.column === this.selectedSquare?.column;
            return selected;
        },
    },
    methods: {
        onMouseDown() {
            const square: Square = { row: this.row, column: this.column, piece: this.piece };
            this.$emit('mousedown', square);
        },
        onMouseUp() {
            const square: Square = { row: this.row, column: this.column, piece: this.piece };
            this.$emit('mouseup', square);
        }
    }
})
</script>

<style scoped lang="sass">
.dot
  height: inherit
  width: inherit
  border-radius: 50%
  border: 10px solid #bbb
.highlight
  height: inherit
  width: inherit
  border-radius: 50%
  border: 10px solid #5b5

.on-square
  grid-column: 1
  grid-row: 1
</style>
