<template>
  <div class='container'>
    <div class='col-sm-10'>
      <h1>Задачи</h1>
      <confirmation1  :message="confirmationMessage" v-if="showConfirmation"></confirmation1>
      <button type='button' id='task-add' class='btn btn-success btn-sm align-left d-block'
      v-b-modal.todo-modal>
        Добавить задачу
        </button>
      <h3>Всего задач: {{alltasks}} выполнено: {{truetasks}}.</h3>
      <table class='table table-dark table-stripped table-hover'>
        <thead class='thead-light'>
          <tr>
            <th>Uid</th>
            <th>Описание</th>
            <th>Выполнена?</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for='(todo, index) in todos' :key='index'>
            <td class='todo-uid'>{{ todo.uid }}</td>
            <td>{{ todo.description }}</td>
            <td>
              <span v-if='todo.is_completed[0] === "true"'>Выполнено</span>
              <span v-else>Не выполнено</span>
            </td>
            <td>
              <div class='btn-group' role='group'>
                <button type='button'
                  class='btn btn-secondary btn-sm'
                  v-b-modal.todo-update-modal
                  @click="updateTodo(todo)"
                  >
                  Обновить
                </button>
                &nbsp;
                <button type='button' class='btn btn-danger btn-sm'
                @click="deleteTodo(todo)"
                >X
                </button>
              </div>
            </td>
          </tr>
        </tbody>

      </table>
    </div>
    <!-- всплывающие окна ввиде компонентов -->
    <!-- через пользовательские события передали параметры заданий из компонентов в методы -->
    <addtask @addtodo='onSubmit'></addtask>
    <changetask v-bind:updatetask="updatetask" @updatedtask='onUpdateSubmit'></changetask>
  </div>
</template>

<style>
button#task-add {
  margin-top: 20px;
  margin-bottom: 20px;
}
h1, td {
  text-align: left;
}
.todo-uid {
  text-align: right;
}
</style>

<script>
import axios from 'axios';
import Confirmation from './Confirmation.vue';

const todoListURL = 'http://localhost:5000/api/tasks/';
const todoAddURL = 'http://localhost:5000/api/add-task/';

export default {
  name: 'Todo',
  data() {
    return {
      todos: [],
      updatetask: {
        uid: 0,
        description: '',
        is_completed: [false],
      },
      confirmationMessage: '',
      showConfirmation: false,
      connect: true,
      taskid: localStorage.getItem('taskid'),
      ar: [],
      ob: {},
      a: null,
      keys: [],
      i: null,
    };
  },
  methods: {
    getTodos() {
      //  проверка на соединение с сервером
      if (this.connect === false) {
        this.todos = [];
        //  из localstorage достаем массив и если он есть проходим поэлементно
        //  выявляя ключ каждого чтобы по ключу добавлять в массив todos знаыение каждого объекта
        //  {'tasks': [{1:{params of task}, {2:{params of task}, ...]}
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks !== null) {
          tasks.forEach((task) => {
            this.keys = Object.keys(task);
            this.todos.push(task[this.keys[0]]);
          });
        } else console.log('Задания отсутствуют!');
      } else {
        //  axios описывали в модуле
        axios
          .get(todoListURL)
          .then((response) => {
            this.todos = response.data.tasks;
          })
          //  обработка ошибки с изменением значения connect и повторным вызовом getTodos()
          // для работы с localstorage
          .catch((error) => {
            this.connect = false;
            console.log('Обработка ошибки Get запроса', error);
            this.getTodos();
          });
      }
    },
    updateTodo(todo) {
      //  присваиваем updatetask параметры выбранного элемента
      this.updatetask = todo;
    },
    onUpdateSubmit(updatedtask) {
      if (this.connect === false) {
        //  из localstorage достаем массив и если он есть проходим поэлементно
        //  по ключу сравнивая значения uid, найденному элементу присваиваем значения
        //   выбранного элемента и перезаписываем localstorage с новым значением
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks.forEach((task) => {
          this.keys = Object.keys(task);
          if (task[this.keys[0]].uid === this.updatetask.uid) {
            this.i = tasks.indexOf(task);
            tasks[this.i][this.keys[0]].description = updatedtask.description;
            tasks[this.i][this.keys[0]].is_completed = updatedtask.is_completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
          }
        });
        this.getTodos();
        //  вызываем всплывающее окно
        this.confirmationMessage = `Задача ${updatedtask.description} обновлена`;
        this.showConfirmation = true;
      } else {
        const todoURL = todoListURL + this.updatetask.uid;
        axios
          .put(todoURL, updatedtask)
          .then(() => {
            this.getTodos();
            this.confirmationMessage = `Задача ${updatedtask.description} обновлена`;
            this.showConfirmation = true;
          })
          //  обработка ошибки
          .catch((error) => {
            console.log('Обработка ошибки PUT запроса', error);
          });
      }
    },
    onSubmit(addtodo) {
      if (this.connect === false) {
        //  в localstorage создаем отдельный счётчик уникальных uid - taskid
        //  и при создании новых заданий присваиваем его uid заданиям
        //  по uid происходит опознование заданий при их изменении или удалении
        if (this.taskid === null) {
          this.taskid = 1;
          localStorage.setItem('taskid', this.taskid);
          this.a = addtodo;
          //  присваиваем значение уникально taskid в uid нового задания
          this.a.uid = this.taskid;
          //  создаём объект {1:{params of task} ключ которого равен uid нового задания
          this.ob[this.taskid] = this.a;
          //  помещаем этот объект в массив, где будут храниться задания и сохраняем в localStorage
          //  {'tasks': [{1:{params of task}, {2:{params of task}, ...]}
          this.ar.push(this.ob);
          localStorage.setItem('tasks', JSON.stringify(this.ar));
        } else {
          this.taskid = Number(localStorage.getItem('taskid')) + 1;
          localStorage.setItem('taskid', this.taskid);
          //  выгружаем массив с задания из localStorage далее см. выше
          this.ar = JSON.parse(localStorage.getItem('tasks'));
          this.ob = {};
          this.a = addtodo;
          this.a.uid = this.taskid;
          this.ob[this.taskid] = this.a;
          this.ar.push(this.ob);
          localStorage.setItem('tasks', JSON.stringify(this.ar));
        }
        this.getTodos();
        this.confirmationMessage = `Задача "${addtodo.description}" добавлена`;
        this.showConfirmation = true;
      } else {
        axios
          .post(todoAddURL, addtodo)
          .then(() => {
            this.getTodos();
            this.confirmationMessage = `Задача "${addtodo.description}" добавлена`;
            this.showConfirmation = true;
          })
          //  обработка ошибки
          .catch((error) => {
            console.log('Обработка ошибки POST запроса', error);
          });
      }
    },
    deleteTodo(todo) {
      //  из localstorage достаем массив и если он есть проходим поэлементно
      //  по ключу сравнивая значения uid, найденному элементу и вырезаем его из массива
      //  d - порядковый номер задания в массиве [0, 1, 2, ...]
      if (this.connect === false) {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        let d = 0;
        tasks.forEach((task) => {
          this.keys = Object.keys(task);
          if (task[this.keys[0]].uid === todo.uid) {
            this.a = task[this.keys[0]];
            tasks.splice(d, 1);
          }
          d += 1;
        });
        //  уменьшаем значение уникально taskid если удаляем крайние задания
        //  и обнуляем если не остаётся заданий
        this.taskid = Number(localStorage.getItem('taskid'));
        if (this.taskid === todo.uid) {
          this.taskid -= 1;
          localStorage.setItem('taskid', this.taskid);
        }
        if (tasks.length === 0) {
          this.taskid = 0;
          localStorage.setItem('taskid', this.taskid);
        }
        //  обновляем localStorage пояле удаления задания
        localStorage.setItem('tasks', JSON.stringify(tasks));
        this.getTodos();
        this.confirmationMessage = `Задача "${todo.uid} удалена.`;
        this.showConfirmation = true;
      } else {
        const todoURL = todoListURL + todo.uid;
        axios
          .delete(todoURL)
          .then((res) => {
            this.getTodos();
            this.confirmationMessage = `Задача "${res.data} удалена.`;
            this.showConfirmation = true;
          })
          //  обработка ошибки
          .catch((error) => {
            console.log('Обработка ошибки Delete запроса', error);
          });
      }
    },
  },
  created() {
    this.getTodos();
  },
  computed: {
    alltasks() {
      //  определяется кол-во заданий
      const allt = this.todos.length;
      return allt;
    },
    truetasks() {
      //  определяется кол-во выполненных заданий
      let truet = 0;
      this.todos.forEach((element) => {
        if (element.is_completed[0] === 'true') {
          truet += 1;
        }
      });
      return truet;
    },
  },
  components: {
    confirmation1: Confirmation,
  },
};

</script>
