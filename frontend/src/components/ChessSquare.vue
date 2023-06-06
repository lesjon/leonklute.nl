<template>
  <q-responsive ratio="1">
    <div :style="style" @click="onClick" style="display: grid;">
      <div class="dot" v-if="highlight" style="grid-column: 1; grid-row: 1;"></div>
      <div class="dot" v-if="selected" style="grid-column: 1; grid-row: 1;"></div>
      <q-img :src="pieceImageFilename" v-if="piece"  style="grid-column: 1; grid-row: 1;"/>
    </div>
  </q-responsive>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { fen2FullName } from './chess-game';

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
      type: String,
      required: false,
    },
    highlight: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      selected: false,
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
      if (!this.piece || this.piece == '0') return;
      const fullName = fen2FullName(this.piece);
      return `src/assets/pieces/${fullName}.png`;
    },
  },
  methods: {
    onClick() {
      console.log('clicked', this.row, this.column, this.piece);
      this.selected = !this.selected;
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
