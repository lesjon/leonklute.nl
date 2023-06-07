<template>
  <q-responsive ratio="1">
    <div :style="style" @click="onClick" style="display: grid;">
      <div class="highlight" v-if="highlight" style="grid-column: 1; grid-row: 1;"></div>
      <div class="dot" v-if="selected" style="grid-column: 1; grid-row: 1;"></div>
      <q-img loading="eager" :src="pieceImageFilename" v-if="piece" style="grid-column: 1; grid-row: 1;" no-spinner/>
    </div>
  </q-responsive>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Square } from './chess-board';
import ChessPiece from './chess-pieces';

export default defineComponent({
  name: 'ChessSquare',
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
  },
  emits: ['click'],
  computed: {
    backgroundColor() {
      return (this.column + this.row) % 2 === 0 ? '#EFEFEF' : '#b58863';
    },
    style() {
      return `background-color:${this.backgroundColor};`;
    },
    pieceImageFilename() {
      if (!this.piece) return;
      return `src/assets/pieces/${this.piece.getFullName()}.png`;
    },
    selected() {
      const selected = this.row === this.selectedSquare?.row && this.column === this.selectedSquare?.column;
      return selected;
    },
  },
  methods: {
    onClick() {
      const square: Square = { row: this.row, column: this.column, piece: this.piece };
      this.$emit('click', square);
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
</style>
