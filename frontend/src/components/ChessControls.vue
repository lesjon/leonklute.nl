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
      <q-table :rows="mainLine" :columns="COLUMNS" :rows-per-page-options="[0]" hide-pagination hide-no-data/>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { copyToClipboard, QTableColumn } from 'quasar';
import { defineComponent, PropType } from 'vue';
import ChessGame, { Move } from './chess-game';
import Fen from './fen';
import San from './san';
import { columnLetters } from './chess-board';

interface MovesWithIndex {
  index: number;
  moveWhite: Move;
  moveBlack: Move;
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
    const san = new San();
    return {
      columnLetters,
      COLUMNS: [
        {
          name: 'index',
          label: '#',
          field: 'index',
          align: 'left',
          style: 'width: 3ch',
        },
        {
          name: 'moveWhite',
          label: 'White',
          field: 'moveWhite',
          align: 'left',
          format: (move) => san.formatMove(move)
        },
        {
          name: 'moveBlack',
          label: 'Black',
          field: 'moveBlack',
          align: 'left',
          format: (move) => san.formatMove(move)
        },
      ] as QTableColumn[],
      san
    };
  },
  computed: {
    fen() {
      if (!this.game) {
        return '';
      }
      return Fen.toFen(this.game);
    },
    mainLine(): MovesWithIndex[] {
      const indexedMoves = this.game?.getMainLine()?.map((move, index) => { return { index, move } }) ?? [];
      const movesWithIndex: MovesWithIndex[] = [];
      for (let i = 0; i < indexedMoves.length; i += 2) {
        movesWithIndex.push({
          index: (indexedMoves[i].index / 2) + 1,
          moveWhite: indexedMoves[i].move,
          moveBlack: indexedMoves[i + 1]?.move,
        });
      }
      return movesWithIndex;
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
    }
  },
})
</script>
