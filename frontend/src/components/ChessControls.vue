<template>
  <q-card style="width: 80ch; ">
    <q-card-actions align="between">
      <q-btn color="primary" label="New Game" @click="$emit('new-game')" />
      <q-btn color="primary" label="Draw" @click="() => game?.draw()" />
      <q-btn color="primary" label="Flip Board" @click="$emit('flip')" />
      <q-btn flat @click="expand = !expand" :icon="expand ? 'expand_less' : 'expand_more'" />
    </q-card-actions>
    <q-card-section v-if="expand" style="max-width: inherit;" class="q-gutter-sm">
      <div class="row">
        <q-input class="col-grow" outlined readonly dense :model-value="fen" @click="copyFen" />
        <q-btn color="primary" label="View PGN" @click="viewPgn = true" :disable="game === undefined" />
      </div>
      <q-table :rows="mainLine" :columns="columns" :rows-per-page-options="[0]" hide-no-data dense>
        <template v-slot:body-cell-moveWhite="props">
          <q-td :props="props" style="font-size: large;" :class="(props.row.highlightWhite) ? 'bg-accent' : ''">
            {{ props.value }}
          </q-td>
        </template>
        <template v-slot:body-cell-moveBlack="props">
          <q-td :props="props" style="font-size: large;" :class="(props.row.highlightBlack) ? 'bg-accent' : ''">
            {{ props.value }}
          </q-td>
        </template>
        <template v-slot:pagination>
          <q-tr>
            <q-td colspan="3">
              <q-select color="primary" label="format" style="width: 12ch;" v-model="sanFormat"
                :options="sanFormatOptions" />

            </q-td>
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
    <q-dialog v-model="viewPgn" v-if="game">
      <PgnViewer :game="game" />
    </q-dialog>
  </q-card>
</template>

<script lang="ts">
import { copyToClipboard, QTableColumn } from 'quasar';
import { defineComponent } from 'vue';
import PgnViewer from './PgnViewer.vue';
import ChessGame from './chess-game';
import Move from './chess-move';
import Fen from './fen';
import San, { SanFormat } from './san';
import { columnLetters } from './chess-board';

interface MovesWithIndex {
  index: number;
  highlightWhite: boolean,
  highlightBlack?: boolean,
  moveWhite: Move;
  moveBlack?: Move;
}

interface SanFormatOption {
  label: string;
  value: SanFormat;
}

export default defineComponent({
  name: 'ChessControls',
  components: {
    PgnViewer
  },
  props: {
    game: ChessGame,
  },
  emits: ['flip', 'new-game'],
  data() {
    const sanFormatOptions = Object.entries(SanFormat).map(([key, value]) => {
      return { label: key, value: value };
    }).filter((option) => typeof option.value === 'number') as SanFormatOption[];
    return {
      columnLetters,
      SanFormat,
      sanFormatOptions,
      sanFormat: sanFormatOptions[0],
      expand: true,
      viewPgn: false,
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
      const currentMove = this.game.moveTree.getCurrentNode();
      const indexedMoves = this.game.moveTree.getMainLine()?.map((moveNode, index) => { return { index, moveNode: moveNode } }) ?? [];
      const movesWithIndex: MovesWithIndex[] = [];
      for (let i = 0; i < indexedMoves.length; i += 2) {
        movesWithIndex.push({
          index: (indexedMoves[i].index / 2) + 1,
          moveWhite: indexedMoves[i].moveNode.move,
          moveBlack: indexedMoves[i + 1]?.moveNode.move,
          highlightWhite: indexedMoves[i].moveNode.id === currentMove?.id,
          highlightBlack: indexedMoves[i + 1] && indexedMoves[i + 1]?.moveNode.id === currentMove?.id
        });
      }
      return movesWithIndex;
    },
    columns(): QTableColumn[] {
      const san = San.create(this.sanFormat.value);
      return [
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
