<template>
  <q-card>
    <q-card-actions>
      <q-btn class="q-mr-md" color="primary" label="New Game" @click="game?.newGame()" />
      <q-btn class="q-mr-md" color="primary" label="Flip Board" @click="$emit('flip')" />
    </q-card-actions>
    <q-card-section @click="copyFen" style="width: 90ch; max-width: inherit;">
      <q-input outlined readonly dense :model-value="game?.toFen()" />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { copyToClipboard } from 'quasar';
import { defineComponent, PropType } from 'vue';
import ChessGame from './chess-game';

export default defineComponent({
  name: 'ChessControls',
  props: {
    game: {
      type: Object as PropType<ChessGame>,
    }
  },
  emits: ['flip'],
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
      copyToClipboard(this.game.toFen()).then(() => {
        this.$q.notify({
          message: 'FEN copied to clipboard',
          color: 'positive',
        })
      }).catch(this.failedToCopy);
    },
  },
})
</script>
