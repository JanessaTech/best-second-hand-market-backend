const userController = require('../../controllers/user.controller')
const userService = require('../../services/user.service')
const messageHelper = require('../../helpers/internationaliztion/messageHelper')
const {mockRequest, mockResponse} = require('../util/interceptor')
const { when } = require('jest-when') 
const { UserError } = require('../../routes/user/UserErrors')

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
            const next = jest.fn()

            await userController.register(req, res, next)

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

        test('should go to the error handing chain when calling userService.register is failed', async () => {
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

    describe('getUserByWalletAddress', () => {
        test('should should go to the error handing chain when userService.getUserByAddress returns empty', async () => {
            let req = mockRequest()
            let res = mockResponse()
            req.params = {address: 'some-address'}
            userService.getUserByAddress = jest.fn()
            when(userService.getUserByAddress).calledWith(req.params.address).mockRejectedValue(new UserError())
            const next = jest.fn()

            await userController.getUserByWalletAddress(req, res, next)

            await expect(userService.getUserByAddress(req.params.address)).rejects.toBeInstanceOf(UserError)
            expect(next).toHaveBeenCalled()
        })

        test('should get the user by the address successfully', async () => {
            let req = mockRequest()
            let res = mockResponse()
            req.params = {address: 'some-address'}
            const payload = {name: 'some-name'}
            userService.getUserByAddress = jest.fn()
            when(userService.getUserByAddress).calledWith(req.params.address).mockResolvedValue(payload)
            when(messageHelper.getMessage).calledWith('user_getByAddress', req.params.address).mockReturnValue('some message')
            const next = jest.fn()

            await userController.getUserByWalletAddress(req, res, next)

            await expect(userService.getUserByAddress(req.params.address)).resolves.toEqual(payload)
            expect(messageHelper.getMessage('user_getByAddress', req.params.address)).toEqual('some message')
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                code: 200,
                message: 'some message',
                data: {user: payload}
            })
        })
    })
})