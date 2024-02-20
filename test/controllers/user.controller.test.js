const userController = require('../../controllers/user.controller')
const userService = require('../../services/user.service')
const messageHelper = require('../../helpers/internationaliztion/messageHelper')
const {mockRequest, mockResponse} = require('../util/interceptor')
const { when } = require('jest-when') 

describe('UserController', () => {
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
            //userService.register = jest.fn(async (user) => payload)  // if we define mock in this way, it means we don't care what the parameter actually is
            //messageHelper.getMessage = jest.fn((key, ...params) => 'some message')
            userService.register = jest.fn()
            messageHelper.getMessage = jest.fn()
            when(userService.register).calledWith(user).mockResolvedValue(payload)
            when(messageHelper.getMessage).calledWith('user_register', user.name).mockReturnValue('some message')
            
            await userController.register(req, res, null)

            await expect(userService.register(user)).resolves.toEqual(payload)
            expect(messageHelper.getMessage('user_register', user.name)).toEqual('some message')
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                code: 200,
                message: 'some message',
                data: {user: payload}
            })
        });

        test('should throw an error when calling userService.register is failed', async () => {
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
    })
})