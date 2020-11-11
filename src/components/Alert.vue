<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-12">
        <div id="error-message" class="alert alert-danger">
          {{message}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "AlertVue",
  props: ['message'],
}
</script>
