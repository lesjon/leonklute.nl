<template>
  <q-banner v-if="player">
    <q-avatar>
      <img :src="player.avatar" />
    </q-avatar>
    <q-badge color="primary" v-if="player.title">{{ player.title }}</q-badge>
    {{ player.name }}
  </q-banner>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import ChessGame from './chess-game';
import { PlayerColor } from './chess-pieces';

export default defineComponent({
  name: 'PlayerCard',
  props: {
    game: {
      type: Object as PropType<ChessGame>,
    },
    color: {
      type: String as PropType<PlayerColor>,
      default: 'w',
    },
  },
  computed: {
    player() {
      return this.color === 'w' ? this.game?.whitePlayer : this.game?.blackPlayer;
    },
  },
})
</script>
