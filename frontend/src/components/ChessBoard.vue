<template>
  <q-responsive ratio="1" class="col" :style="`max-width: ${boardsize}vh;`">
    <div>
      <div class="row" v-for="row in rows" :key="row">
        <chess-square :piece="game?.getPieceAt(row, column)" class="col" v-for="column in columns" :key="column"
          :row="row" :column="column" />
      </div>
    </div>
  </q-responsive>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ChessGame, { rows, columns } from './chess-game';
import ChessSquare from './ChessSquare.vue';


export default defineComponent({
  name: 'ChessBoard',
  components: {
    ChessSquare,
  },
  props: {
    game: {
      type: Object as PropType<ChessGame>,
    },
  },
  data() {
    return {
      rows,
      columns,
      boardsize: 80,
    };
  }
})
</script>
