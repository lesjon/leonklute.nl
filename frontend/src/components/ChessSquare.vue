<template>
  <q-responsive ratio="1">
    <div :style="style" style="display: grid;" @mousedown="onMouseDown" @mouseup="onMouseUp">
      <q-img loading="eager" :src="pieceImageFilename" v-if="piece" class="on-square" no-spinner/>
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
import ChessPiece from './chess-pieces';
import PromotionPicker from './PromotionPicker.vue';

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
                return;
            return `src/assets/pieces/${this.piece.getFullName()}.png`;
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
