const express = require('express')
const router = express.Router()
const controller = require('../../controllers/todo.controller')
const initTodoErrorHandlers = require('./todoErrorHandlers')
const {todoSchema} = require('../schemas')
const {validate, authenticate, authorize} = require('../../middlewares')
const userService = require('../../services/user.service')

router.get('/:user', authenticate(userService), authorize(), validate(todoSchema.getAllTodos), controller.getAllTodos)
router.post('/', authenticate(userService), authorize(), validate(todoSchema.creatTodo), controller.creatTodo)
router.put('/', authenticate(userService), authorize(), validate(todoSchema.updateTodo), controller.updateTodo)
router.delete('/:user/:id', authenticate(userService), authorize(), validate(todoSchema.deleteTodoById), controller.deleteTodoById)

initTodoErrorHandlers(router)

module.exports = router