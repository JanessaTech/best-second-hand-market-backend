const logger = require("../helpers/logger");
const todoService = require('../services/todo.service')
const {sendSuccess} = require("../helpers/reponseHandler");
const messageHelper = require("../helpers/internationaliztion/messageHelper");

class TodoController {
    async getAllTodos(req, res, next) {
        logger.info('TodoController.getAllTodos')
        try {
            let user = parseInt(req.params.user)
            let payload = await todoService.getAllTodos(user)
            sendSuccess(res, messageHelper.getMessage('todo_getAll', user), payload)
        } catch (e) {
            next(e)
        }
    }

    async creatTodo(req, res, next) {
        logger.info('TodoController.creatTodo')
        try {
            let user = req.body.user //user id
            let todo = {title: req.body.title, body: req.body.body}
            let payload = await todoService.creatTodo(user, todo)
            sendSuccess(res, messageHelper.getMessage('todo_create', payload.id, user), payload)
        } catch(e) {
            next(e)
        }
    }
    async updateTodo(req, res, next) {
        logger.info('TodoController.updateTodo')
        try {
            let user = req.body.user //user id
            let todo = {id: req.body.id, title: req.body.title, body: req.body.body}
            let payload = await todoService.updateTodo(user, todo)
            sendSuccess(res, messageHelper.getMessage('todo_update', payload.id, user), payload)
        } catch (e) {
            next(e)
        }
    }

    async deleteTodoById(req, res, next) {
        logger.info('TodoController.deleteUserById')
        try{
            let user = parseInt(req.params.user) //user id
            await todoService.deleteTodoById(user, parseInt(req.params.id))
            sendSuccess(res, messageHelper.getMessage('todo_deleteById', req.params.id, user))
        } catch (e) {
            next(e)
        }
    }
}

const controller = new TodoController()
module.exports = controller