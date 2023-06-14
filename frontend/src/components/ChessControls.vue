<template>
  <q-card style="width: 80ch; ">
    <q-card-actions align="between">
      <q-btn class="q-mr-md" color="primary" label="New Game" @click="$emit('new-game')" />
      <q-btn class="q-mr-md" color="primary" label="Flip Board" @click="$emit('flip')" />
      <q-btn flat @click="expand = !expand" :icon="expand ? 'expand_less' : 'expand_more'" />
    </q-card-actions>
    <q-card-section v-if="expand" style="max-width: inherit;" class="q-gutter-sm">
      <q-input outlined readonly dense :model-value="fen" @click="copyFen" />
      <q-table :rows="mainLine" :columns="COLUMNS" :rows-per-page-options="[0]" hide-no-data>
        <template v-slot:body-cell-moveWhite="props">
          <q-td :props="props" :class="(props.row.highlightWhite) ? 'bg-accent' : ''">
            {{ props.value }}
          </q-td>
        </template>
        <template v-slot:body-cell-moveBlack="props">
          <q-td :props="props" :class="(props.row.highlightBlack) ? 'bg-accent' : ''">
            {{ props.value }}
          </q-td>
        </template>
        <template v-slot:pagination>
          <q-tr>
            <q-td colspan="3" class="text-right">
              <q-btn flat icon="chevron_left" @click="game?.moveBack()" :disable="!game?.canMoveBack()" />
            </q-td>
            <q-td colspan="3" class="text-right">
              <q-btn flat icon="chevron_right" @click="game?.moveForward()" :disable="!game?.canMoveForward()" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { copyToClipboard, QTableColumn } from 'quasar';
import { defineComponent, PropType } from 'vue';
import ChessGame from './chess-game';
import Move from './chess-move';
import Fen from './fen';
import San from './san';
import { columnLetters } from './chess-board';

interface MovesWithIndex {
  index: number;
  highlightWhite: boolean,
  highlightBlack?: boolean,
  moveWhite: Move;
  moveBlack?: Move;
}

const san = new San();

const
  COLUMNS: QTableColumn[] = [
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
    }
  ]

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
      COLUMNS,
      san,
      expand: true,
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
      if (!this.game) {
        return [];
      }
      const currentMove = this.game.getCurrentMoveNode();
      const indexedMoves = this.game?.getMainLine()?.map((moveNode, index) => { return { index, moveNode: moveNode } }) ?? [];
      const movesWithIndex: MovesWithIndex[] = [];
      for (let i = 0; i < indexedMoves.length; i += 2) {
        movesWithIndex.push({
          index: (indexedMoves[i].index / 2) + 1,
          moveWhite: indexedMoves[i].moveNode.move,
          moveBlack: indexedMoves[i + 1]?.moveNode.move,
          highlightWhite: indexedMoves[i].moveNode.id === currentMove?.id,
          highlightBlack: indexedMoves[i + 1]?.moveNode.id === currentMove?.id
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
