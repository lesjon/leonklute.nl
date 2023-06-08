<template>
  <q-card>
    <q-card-actions>
      <q-btn class="q-mr-md" color="primary" label="New Game" @click="$emit('new-game')" />
      <q-btn class="q-mr-md" color="primary" label="Flip Board" @click="$emit('flip')" />
    </q-card-actions>
    <q-card-section @click="copyFen" style="width: 90ch; max-width: inherit;">
      <q-input outlined readonly dense :model-value="fen" />
    </q-card-section>
    <q-card-section>
      <span v-for="move in mainLine" :key="move.index">
        {{ pieceSymbol(move.move) + takeSymbol(move.move) +
          columnLetters[move.move.column] + move.move.row + checkSymbol(move.move) }}
        <br v-if="move.index % 2"><span v-else>&nbsp;</span>
      </span>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { copyToClipboard } from 'quasar';
import { defineComponent, PropType } from 'vue';
import ChessGame, { Move } from './chess-game';
import Fen from './fen';
import { columnLetters } from './chess-board';

interface MoveWithIndex {
  index: number;
  move: Move;
}

export default defineComponent({
  name: 'ChessControls',
  props: {
    game: {
      type: Object as PropType<ChessGame>,
    }
  },
  emits: ['flip', 'new-game'],
  data() {
    return {
      columnLetters,
    };
  },
  computed: {
    fen() {
      if (!this.game) {
        return '';
      }
      return Fen.toFen(this.game);
    },
    mainLine(): MoveWithIndex[] {
      if (!this.game) {
        return [];
      }
      return this.game.getMainLine()?.map((move, index) => { return { index, move } }) ?? [];
    }
  },
  methods: {
    failedToCopy() {
      this.$q.notify({
        message: 'Failed to copy FEN to clipboard',
        color: 'negative',
      });
    },
    copyFen() {
      if (!this.game) {
        this.failedToCopy();
        return;
      }
      copyToClipboard(this.fen).then(() => {
        this.$q.notify({
          message: 'FEN copied to clipboard',
          color: 'positive',
        })
      }).catch(this.failedToCopy);
    },
    pieceSymbol(move: Move) {
      const piece = move.piece;
      switch (piece.getFenKey()) {
        case 'p':
        case 'P':
          if (move.takes && move.from) { return columnLetters[move.from?.column]; }
          return '';
        case 'N':
          return '♘';
        case 'B':
          return '♗';
        case 'R':
          return '♖';
        case 'Q':
          return '♕';
        case 'K':
          return '♔';
        case 'n':
          return '♞';
        case 'b':
          return '♝';
        case 'r':
          return '♜';
        case 'q':
          return '♛';
        case 'k':
          return '♚';
        default:
          return '';
      };
    },
    checkSymbol(move: Move) {
      if (move.check) {
        return move.checkmate ? '#' : '+';
      }
      return '';
    },
    takeSymbol(move: Move) {
      return move.takes ? 'x' : '';
    },
  },
})
</script>
