const logger = require("../helpers/logger");
const {TodoError} = require("../routes/todo/TodoErrors");

class TodoService {
    todoMap = new Map()
    indexMap = new Map()

    async getAllTodos(user) {
        if (this.todoMap.get(user)) {
            return Object.fromEntries(this.todoMap.get(user))
        }
        return {}
    }

    async creatTodo(user, todo) {
        logger.info('TodoService.creatTodo...')
        if (this.todoMap.get(user)) {
            let ind = this.indexMap.get(user)
            todo.id = ind + 1
            this.todoMap.get(user).set(ind + 1, todo)
            this.indexMap.set(user, ind + 1)
        } else {
            let userMap = new Map()
            todo.id = 0
            userMap.set(0, todo)
            this.todoMap.set(user, userMap)
            this.indexMap.set(user, 0)
        }
        return todo
    }
    async updateTodo(user, todo) {
        logger.info('TodoService.updateTodo...')
        if (this.todoMap.has(user) && this.todoMap.get(user).has(todo.id)) {
            this.todoMap.get(user).set(todo.id, todo)
            return todo
        } else {
            throw new TodoError({key: 'todo_not_found', params:[todo.id, user]})
        }
    }

    async deleteTodoById(user, id) {
        logger.info('TodoService.deleteTodoById...')
        if (this.todoMap.has(user) && this.todoMap.get(user).has(id)) {
            this.todoMap.get(user).delete(id)
        } else {
            throw new TodoError({key: 'todo_not_found', params:[id, user]})
        }
    }
}

const controller = new TodoService()
module.exports = controller