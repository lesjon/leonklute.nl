<template>
  <q-responsive ratio="1">
    <div :style="style" @click="onClick" style="display: grid;">
      <div class="dot" v-if="highlight" style="grid-column: 1; grid-row: 1;"></div>
      <div class="dot" v-if="selected" style="grid-column: 1; grid-row: 1;"></div>
      <q-img :src="pieceImageFilename" v-if="piece" style="grid-column: 1; grid-row: 1;" />
    </div>
  </q-responsive>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ChessPiece, Square, fen2FullName } from './chess-game';
import { PropType } from 'vue';

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
      const fullName = this.piece.fullName;
      return `src/assets/pieces/${fullName}.png`;
    },
    selected() {
      const selected = this.row === this.selectedSquare?.row && this.column === this.selectedSquare?.column;
      return selected;
    },
  },
  methods: {
    onClick() {
      console.log('click square:', this.row, this.column, this.piece);
      this.$emit('click', this.row, this.column, this.piece);
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
</style>
