const userDao = require('../../dao/user')
const {UserError} = require('../../routes/user/UserErrors')
const userService = require('../../services/user.service')
const { when } = require('jest-when')

beforeAll(() => {
    userDao.findByName = jest.fn()
    userDao.findByAddress = jest.fn()
    userDao.create = jest.fn()
    userDao.findByAddressAndUpdateLoginTime = jest.fn()

})

describe("UserService", () => {
    describe("register", () => {
        test('expects UserError when userDao.findByName returns non empty', async () => {
            const user ={name: 'some-name', address: 'some-address'}
            when(userDao.findByName).calledWith(user.name).mockResolvedValue({})

            await expect(userService.register(user))
            .rejects
            .toBeInstanceOf(UserError)
            expect(userDao.findByName).toHaveBeenCalledWith(user.name)
            expect(userDao.findByAddress).toHaveBeenCalledTimes(0)
            expect(userDao.create).toHaveBeenCalledTimes(0)
        })

        test('expect UserError when userDao.findByAddress returns non empty', async () => {
            const user ={name: 'some-name', address: 'some-address'}
            when(userDao.findByName).calledWith(user.name).mockResolvedValue(undefined)
            when(userDao.findByAddress).calledWith(user.address).mockResolvedValue({})
            
            await expect(userService.register(user))
            .rejects
            .toBeInstanceOf(UserError)
            expect(userDao.findByName).toHaveBeenCalledWith(user.name)
            expect(userDao.findByAddress).toHaveBeenCalledWith(user.address)
            expect(userDao.create).toHaveBeenCalledTimes(0) 
        })

        test('expect UserError when userDao.create is failed', async () => {
            const user ={name: 'some-name', address: 'some-address'}
            when(userDao.findByName).calledWith(user.name).mockResolvedValue(undefined)
            when(userDao.findByAddress).calledWith(user.address).mockResolvedValue(undefined)
            when(userDao.create).calledWith(user).mockRejectedValue(new UserError())
           
            await expect(userService.register(user))
            .rejects
            .toBeInstanceOf(UserError)
            expect(userDao.findByName).toHaveBeenCalledWith(user.name)
            expect(userDao.findByAddress).toHaveBeenCalledWith(user.address)
            expect(userDao.create).toHaveBeenCalledWith(user)
        })

        test('should register a new user successfully', async () => {
            const user ={name: 'some-name', address: 'some-address'}
            when(userDao.findByName).calledWith(user.name).mockResolvedValue(undefined)
            when(userDao.findByAddress).calledWith(user.address).mockResolvedValue(undefined)
            when(userDao.create).calledWith(user).mockResolvedValue({})

            const newUser = await userService.register(user)

            expect(userDao.findByName).toHaveBeenCalledWith(user.name)
            expect(userDao.findByAddress).toHaveBeenCalledWith(user.address)
            expect(userDao.create).toHaveBeenCalledWith(user)
            expect(newUser).toEqual({})
        })
    })

    describe('getUserByAddress', () => {
        test('expect UserError when userDao.findByAddress returns empty', async () => {
            const address = 'some-address'
            when(userDao.findByAddress).calledWith(address).mockResolvedValue(undefined)

            await expect(userService.getUserByAddress(address))
            .rejects
            .toBeInstanceOf(UserError)
            expect(userDao.findByAddress).toHaveBeenCalledWith(address)
        })

        test('should get an user by the address successfully', async () => {
            const address = 'some-address'
            when(userDao.findByAddress).calledWith(address).mockResolvedValue({})

            const user  = await userService.getUserByAddress(address)

            expect(userDao.findByAddress).toHaveBeenCalledWith(address)
            expect(user).toEqual({})
        })
    })

    describe('loginByAddress', () => {
        test('expect UserError when userDao.findByAddressAndUpdateLoginTime returns empty', async () => {
            const address = 'some-address'
            when(userDao.findByAddressAndUpdateLoginTime).calledWith(address).mockResolvedValue(null)

            await expect(userService.loginByAddress(address))
            .rejects
            .toBeInstanceOf(UserError)
            expect(userDao.findByAddress).toHaveBeenCalledWith(address)
        })
    })
})