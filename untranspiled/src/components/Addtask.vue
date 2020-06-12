<template>
  <div class='container'>
    <b-modal ref="addTodoModal"
        id="todo-modal"
        title="Добавить задачу"
        hide-footer>
      <b-form @submit="onSubmit" @reset="onReset" class="w-100">
        <b-form-group id="form-description-group"
            label="Описание:"
            label-for="form-description-input">
          <b-form-input id="form-description-input"
              type="text"
              v-model="addTodoForm.description"
              required
              placeholder="Завести задачу">
          </b-form-input>
        </b-form-group>
        <b-form-group id="form-complete-group">
          <b-form-checkbox-group v-model="addTodoForm.is_completed" id="form-checks">
            <b-form-checkbox value="true">Задача выполнена?</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
        <b-button type="submit" variant="primary">Добавить</b-button>
        <b-button type="reset" variant="danger">Сброс</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<style>
</style>

<script>

export default {
  data() {
    return {
      addTodoForm: {
        description: '',
        is_completed: [],
        uid: null,
      },
    };
  },
  methods: {
    resetForm() {
      this.addTodoForm.description = '';
      this.addTodoForm.is_completed = [];
    },
    onSubmit(event) {
      event.preventDefault();
      this.$refs.addTodoModal.hide();
      const requestData = {
        description: this.addTodoForm.description,
        is_completed: this.addTodoForm.is_completed,
        uid: null,
      };
      //  оформляем пользовательское событие для передачи requestData в Todos
      this.$emit('addtodo', requestData);
      this.resetForm();
    },
    onReset(event) {
      event.preventDefault();
      //    this.$refs.addTodoModal.hide();
      this.resetForm();
    },
  },
};

</script>
