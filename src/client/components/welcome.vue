<template>
  <div>
    <h1>Welcome, {{name}}!</h1>
  </div>
</template>
<script>
export default {
  props: {
    name: { type: String }
  }
};
</script>
