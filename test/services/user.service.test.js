const userDao = require('../../dao/user')
const {UserError} = require('../../routes/user/UserErrors')
const userService = require('../../services/user.service')
const { when } = require('jest-when')

beforeAll(() => {
    userDao.findOneByFilter = jest.fn()
    userDao.create = jest.fn()
    userDao.findOneAndUpdate = jest.fn()
})

describe("UserService", () => {
    describe("register", () => {
        test('expects UserError when there is an existing user by user name', async () => {
            const user ={name: 'some-name', address: 'some-address'}
            when(userDao.findOneByFilter).calledWith({name: user.name}).mockResolvedValue({})

            await expect(userService.register(user))
            .rejects
            .toBeInstanceOf(UserError)
            expect(userDao.findOneByFilter).toHaveBeenCalledWith({name: user.name})
            expect(userDao.findOneByFilter).toHaveBeenCalledTimes(1)
            expect(userDao.create).toHaveBeenCalledTimes(0)
        })

        test('expect UserError when there is an existing user by user address', async () => {
            const user ={name: 'some-name', address: 'some-address'}
            when(userDao.findOneByFilter).calledWith({name: user.name}).mockResolvedValue(undefined)
            when(userDao.findOneByFilter).calledWith({address: user.address}).mockResolvedValue({})
            
            await expect(userService.register(user))
            .rejects
            .toBeInstanceOf(UserError)
            expect(userDao.findOneByFilter).toHaveBeenCalledWith({name: user.name})
            expect(userDao.findOneByFilter).toHaveBeenCalledWith({address: user.address})
            expect(userDao.create).toHaveBeenCalledTimes(0) 
        })

        test('expect UserError when userDao.create is failed', async () => {
            const user ={name: 'some-name', address: 'some-address'}
            when(userDao.findOneByFilter).calledWith({name: user.name}).mockResolvedValue(undefined)
            when(userDao.findOneByFilter).calledWith({address: user.address}).mockResolvedValue(undefined)
            when(userDao.create).calledWith(user).mockRejectedValue(new UserError())
           
            await expect(userService.register(user))
            .rejects
            .toBeInstanceOf(UserError)
            expect(userDao.findOneByFilter).toHaveBeenCalledWith({name: user.name})
            expect(userDao.findOneByFilter).toHaveBeenCalledWith({address: user.address})
            expect(userDao.create).toHaveBeenCalledWith(user)
        })

        test('should register a new user successfully', async () => {
            const user ={name: 'some-name', address: 'some-address'}
            when(userDao.findOneByFilter).calledWith({name: user.name}).mockResolvedValue(undefined)
            when(userDao.findOneByFilter).calledWith({address: user.address}).mockResolvedValue(undefined)
            when(userDao.create).calledWith(user).mockResolvedValue({})

            const newUser = await userService.register(user)

            expect(userDao.findOneByFilter).toHaveBeenCalledWith({name: user.name})
            expect(userDao.findOneByFilter).toHaveBeenCalledWith({address: user.address})
            expect(userDao.create).toHaveBeenCalledWith(user)
            expect(newUser).toEqual({})
        })
    })

    describe('findUserByAddress', () => {
        test('expect UserError when there is not an user found by address', async () => {
            const address = 'some-address'
            when(userDao.findOneByFilter).calledWith({address: address}).mockResolvedValue(undefined)

            await expect(userService.findUserByAddress(address))
            .rejects
            .toBeInstanceOf(UserError)
            expect(userDao.findOneByFilter).toHaveBeenCalledWith({address: address})
        })

        test('should get an user by the address successfully', async () => {
            const address = 'some-address'
            when(userDao.findOneByFilter).calledWith({address: address}).mockResolvedValue({})

            const user  = await userService.findUserByAddress(address)

            expect(userDao.findOneByFilter).toHaveBeenCalledWith({address: address})
            expect(user).toEqual({})
        })
    })

    describe('loginByAddress', () => {
        test('expect UserError when there is not an user found by address', async () => {
            const address = 'some-address'
            when(userDao.findOneAndUpdate).calledWith({address: address}, {loginTime: expect.anything(Date)}).mockResolvedValue(null)

            await expect(userService.loginByAddress(address))
            .rejects
            .toBeInstanceOf(UserError)
            expect(userDao.findOneAndUpdate).toHaveBeenCalledWith({address: address}, {loginTime: expect.anything(Date)})
        })
    })
})