<template>
  <div class='container'>
    <b-modal ref="updateTodoModal"
            id="todo-update-modal"
            title="Update"
            hide-footer>
      <b-form @submit="onUpdateSubmit" @reset="onReset" class="w-100">
      <b-form-group id="form-update-description-group"
                    label="Описание:"
                    label-for="form-update-description-input">
        <b-form-input id="form-update-description-input"
                      type="text"
                      v-model="updatetask.description"
                      required>
        </b-form-input>
      </b-form-group>
      <b-form-group id="form-update-complete-group">
        <b-form-checkbox-group v-model="updatetask.is_completed" id="form-update-checks">
          <b-form-checkbox value="true">Задача выполнена?</b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group>
      <b-button-group>
        <b-button type="submit" variant="primary">Обновить</b-button>
        <b-button type="reset" variant="danger">Сброс</b-button>
      </b-button-group>
      </b-form>
    </b-modal>
  </div>
</template>

<style>
</style>

<script>

export default {
  props: ['updatetask'],
  data() {
    return {
    };
  },
  methods: {
    resetForm() {
      this.updatetask.description = '';
      this.updatetask.is_completed = [];
    },
    onUpdateSubmit(event) {
      event.preventDefault();
      this.$refs.updateTodoModal.hide();
      const requestData = {
        description: this.updatetask.description,
        is_completed: this.updatetask.is_completed,
        uid: null,
      };
      //  оформляем пользовательское событие для передачи requestData в Todos
      this.$emit('updatedtask', requestData);
    },
    onReset(event) {
      event.preventDefault();
      //    this.$refs.updateTodoModal.hide();
      this.resetForm();
    },
  },
};

</script>
