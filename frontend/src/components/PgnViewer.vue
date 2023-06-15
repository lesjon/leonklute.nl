<template>
  <q-card>
    <q-card-section @click="clip(pgn)">
      <pre>{{ pgn }}</pre>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChessGame from './chess-game';
import Pgn from './pgn';
import { copyToClipboard } from 'quasar';

const pgn = new Pgn();

export default defineComponent({
  name: 'PgnViewer',
  props: {
    game: {
      type: ChessGame,
      required: true
    }
  },
  computed: {
    pgn(): string {
      return this.game !== undefined ? pgn.parseGamge(this.game) : '';
    }
  },
  methods: {
    clip(pgn: string) {
      copyToClipboard(pgn).then(() => {
        this.$q.notify({
          message: 'PGN copied to clipboard',
          color: 'positive'
        });
      });
    }    
  }
});
</script>
