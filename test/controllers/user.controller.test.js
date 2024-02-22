const userController = require('../../controllers/user.controller')
const userService = require('../../services/user.service')
const messageHelper = require('../../helpers/internationaliztion/messageHelper')
const {mockRequest, mockResponse} = require('../util/interceptor')
const { when } = require('jest-when') 
const { UserError } = require('../../routes/user/UserErrors')

let req, res, next

beforeAll(() => {
    userService.register = jest.fn()
    userService.getUserByAddress = jest.fn()
    userService.loginByAddress = jest.fn()
    messageHelper.getMessage = jest.fn()
})

beforeEach(() => {
    req = mockRequest()
    res = mockResponse()
    next = jest.fn()
})

describe('UserController', () => {

    describe('register', () => {
        test('should register a new user successfully', async () => {
            req.body = {
                name : 'some-name',
                address: 'some-address',
                intro: 'some-intro'
            }
            const user = {name: 'some-name', address: 'some-address', intro: 'some-intro'}
            const payload = {id : 1, name: 'some-name', address: 'some-address', intro: 'some-intro'}
            //userService.register = jest.fn(async (user) => payload)  // if we define mock in this way, it means we don't care what the parameter actually is
            //messageHelper.getMessage = jest.fn((key, ...params) => 'some message')
            when(userService.register).calledWith(user).mockResolvedValue(payload)
            when(messageHelper.getMessage).calledWith('user_register', user.name).mockReturnValue('some-message')
            
            await userController.register(req, res, next)

            await expect(userService.register(user)).resolves.toEqual(payload)
            expect(messageHelper.getMessage('user_register', user.name)).toEqual('some-message')
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                code: 200,
                message: 'some-message',
                data: {user: payload}
            })
        });

        test('should go to the error handing chain when calling userService.register is failed', async () => {
            req.body = {
                name : 'some-name',
                address: 'some-address',
                intro: 'some-intro'
            }
            userService.register = jest.fn(async (user) => {throw new UserError()})

            await userController.register(req, res, next)

            expect(next).toHaveBeenCalled()
        })    
    })

    describe('getUserByAddress', () => {
        test('should should go to the error handing chain when userService.getUserByAddress returns empty', async () => {
            req.params = {address: 'some-address'}
            when(userService.getUserByAddress).calledWith(req.params.address).mockRejectedValue(new UserError())
            
            await userController.getUserByAddress(req, res, next)

            await expect(userService.getUserByAddress(req.params.address)).rejects.toBeInstanceOf(UserError)
            expect(next).toHaveBeenCalled()
        })

        test('should get the user by the address successfully', async () => {
            req.params = {address: 'some-address'}
            const payload = {name: 'some-name'}
            when(userService.getUserByAddress).calledWith(req.params.address).mockResolvedValue(payload)
            when(messageHelper.getMessage).calledWith('user_get_by_address', req.params.address).mockReturnValue('some-message')
            
            await userController.getUserByAddress(req, res, next)

            await expect(userService.getUserByAddress(req.params.address)).resolves.toEqual(payload)
            expect(messageHelper.getMessage('user_get_by_address', req.params.address)).toEqual('some-message')
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                code: 200,
                message: 'some-message',
                data: {user: payload}
            })
        })
    })

    describe('loginByAddress', () => {
        test('should go to error handing when userService.loginByAddress throws error', async () => {
            req.body = {address: 'some-address'}
            when(userService.loginByAddress).calledWith(req.body.address).mockRejectedValue(new UserError)

            await userController.loginByAddress(req, res, next)

            await expect(userService.loginByAddress(req.body.address)).rejects.toBeInstanceOf(UserError)
            expect(next).toHaveBeenCalled()
        })

        test('should login successfully with the user returned', async () => {
            req.body = {address: 'some-address'}
            const payload = {user: 'some-name'}
            when(userService.loginByAddress).calledWith(req.body.address).mockResolvedValue(payload)
            when(messageHelper.getMessage).calledWith('user_login_success', req.body.address).mockReturnValue('some-message')

            await userController.loginByAddress(req, res, next)

            await expect(userService.loginByAddress(req.body.address)).resolves.toEqual(payload)
            expect(messageHelper.getMessage('user_login_success', req.body.address)).toEqual('some-message')
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                code: 200,
                message: 'some-message',
                data: {user: payload}
            })
        })
    })
})