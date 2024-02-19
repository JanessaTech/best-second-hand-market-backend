const userDao = require('../../dao/user')
const {UserError} = require('../../routes/user/UserErrors')
const userService = require('../../services/user.service')

describe("UserService", () => {
    describe("register", () => {
        test('expects UserError when userDao.findByName return empty', async () => {
            const user ={name: 'some-name', address: 'some-address'}
            userDao.findByName = jest.fn(async () => undefined)

            await expect(userService.register(user))
            .rejects
            .toBeInstanceOf(UserError)
            expect(userDao.findByName).toHaveBeenCalledWith(user.name)
        })

        test('expect UserError when userDao.findByAddress return empty', async () => {
            const user ={name: 'some-name', address: 'some-address'}
            userDao.findByName = jest.fn(async (name) => {})
            userDao.findByAddress = jest.fn(async (address) => undefined)

            await expect(userService.register(user))
            .rejects
            .toBeInstanceOf(UserError)
            expect(userDao.findByName).toHaveBeenCalledWith(user.name)
            
        })

        test('expect UserError when userDao.create is failed', async () => {
            const user ={name: 'some-name', address: 'some-address'}
            userDao.findByName = jest.fn(async (name) => {})
            userDao.findByAddress = jest.fn(async (address) => {})
            userDao.create = jest.fn(async (user) => {throw new UserError()})

            await expect(userService.register(user))
            .rejects
            .toBeInstanceOf(UserError)
            expect(userDao.findByName).toHaveBeenCalledWith(user.name)
            expect(userDao.findByAddress).toHaveBeenCalledWith(user.address)
        })
    })
})