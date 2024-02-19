const userController = require('../../controllers/user.controller')
const userService = require('../../services/user.service')
const messageHelper = require('../../helpers/internationaliztion/messageHelper')
const {mockRequest, mockResponse} = require('../util/interceptor')

describe('userController', () => {
    describe('register', () => {
        test('should register a new user successfully', async () => {
            let req = mockRequest()
            let res = mockResponse()
            req.body = {
                name : 'some-name',
                address: 'some-address',
                intro: 'some-intro'
            }
            const user = {name: 'some-name', address: 'some-address', intro: 'some-intro'}
            const payload = {id : 1, name: 'some-name', address: 'some-address', intro: 'some-intro'}
            userService.register = jest.fn(async (user) => payload)
            messageHelper.getMessage = jest.fn((key, ...params) => 'some message')

            await userController.register(req, res, null)

            expect(userService.register).toHaveBeenCalledWith(user)
            expect(messageHelper.getMessage).toHaveBeenCalledWith('user_register', 'some-name')
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                code: 200,
                message: 'some message',
                data: {user: payload}
            })
        });

        test('should throw an error when calling userController.register is failed', async () => {
            let req = mockRequest()
            let res = mockResponse()
            req.body = {
                name : 'some-name',
                address: 'some-address',
                intro: 'some-intro'
            }
            const next = jest.fn()
            userService.register = jest.fn(async (user) => {throw new UserError()})

            await userController.register(req, res, next)

            expect(next).toHaveBeenCalled()
        })
        
    }
    
    )
})