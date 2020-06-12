<template>
  <div>
    <!-- добавили крестик закрытия сообщения - dismissible -->
    <b-alert variant="success" show dismissible>{{ message }}</b-alert>
  </div>
</template>

<script>
export default {
  props: ['message'],
};
</script>
