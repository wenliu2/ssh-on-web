<template>
<div>
  <h1>Welcome, {{name}}!</h1>
</div>
</template>
<script lang='babel'>
export default {
  props: {
    name: { type: String }
  }
}
</script>
