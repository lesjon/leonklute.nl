<template>
  <q-responsive ratio="1">
    <div style="display: grid;" v-if="playerColor === 'w'">
      <q-img loading="eager" no-spinner :src="WhiteQueen" style="grid-column: 1; grid-row: 1;" @click="$emit('select', ChessPieceType.whiteQueen)"/>
      <q-img loading="eager" no-spinner :src="WhiteRook" style="grid-column: 1; grid-row: 2;" @click="$emit('select', ChessPieceType.whiteRook)"/>
      <q-img loading="eager" no-spinner :src="WhiteBishop" style="grid-column: 2; grid-row: 1;" @click="$emit('select', ChessPieceType.whiteBishop)"/>
      <q-img loading="eager" no-spinner :src="WhiteKnight" style="grid-column: 2; grid-row: 2;" @click="$emit('select', ChessPieceType.whiteKnight)"/>
    </div>
    <div style="display: grid;" v-else>
      <q-img loading="eager" no-spinner :src="BlackQueen" style="grid-column: 1; grid-row: 1;" @click="$emit('select', ChessPieceType.blackQueen)"/>
      <q-img loading="eager" no-spinner :src="BlackRook" style="grid-column: 1; grid-row: 2;" @click="$emit('select', ChessPieceType.blackRook)"/>
      <q-img loading="eager" no-spinner :src="BlackBishop" style="grid-column: 2; grid-row: 1;" @click="$emit('select', ChessPieceType.blackBishop)"/>
      <q-img loading="eager" no-spinner :src="BlackKnight" style="grid-column: 2; grid-row: 2;" @click="$emit('select', ChessPieceType.blackKnight)"/>
    </div>
  </q-responsive>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ChessPieceType, PlayerColor } from './chess-pieces';
import WhiteQueen from 'assets/pieces/queen_white.png';
import WhiteRook from 'assets/pieces/rook_white.png';
import WhiteBishop from 'assets/pieces/bishop_white.png';
import WhiteKnight from 'assets/pieces/knight_white.png';
import BlackQueen from 'assets/pieces/queen_black.png';
import BlackRook from 'assets/pieces/rook_black.png';
import BlackBishop from 'assets/pieces/bishop_black.png';
import BlackKnight from 'assets/pieces/knight_black.png';

export default defineComponent({
  name: 'PromotionPicker',
  props: {
    playerColor: {
      type: String as PropType<PlayerColor>,
      required: false,
    }
  },
  emits: ['select'],
  data() {
    return {
      ChessPieceType,
      WhiteQueen,
      WhiteRook,
      WhiteBishop,
      WhiteKnight,
      BlackQueen,
      BlackRook,
      BlackBishop,
      BlackKnight,
    };
  },
})
</script>
