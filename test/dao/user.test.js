const userDao = require('../../dao/user')
const {User} = require('../../models')
const { when } = require('jest-when') 
const {UserError} = require("../../routes/user/UserErrors")

describe('UserDAO', () => {
    describe('create', () => {
        test('expect UserError when save user with invalid address', async () => {
            const user = {name: 'some-user', address: 'some-address', intro: 'some-intro'}

            await expect(userDao.create(user))
            .rejects
            .toBeInstanceOf(UserError)
        })

        test('should save a new user successfully', async () => {
            const user = {name: 'some-user', address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', intro: 'some-intro'}
            const savedUser = {id: 1, ...user}
            User.prototype.save = jest.fn(async () => savedUser)  // to-do: investigate why validation on user is skipped

            const res = await userDao.create(user)

            expect(User.prototype.save).toHaveBeenCalled()
            expect(res).toEqual(savedUser)
        })
    })

    describe('findOneBy', () => {
        test('should return an user if the user exists', async () => {
            const name = 'some-name'
            const savedUser = {name: name, id:1}
            //User.findOne = jest.fn(async (name) => savedUser)
            User.findOne = jest.fn()
            when(User.findOne).calledWith({name: name}).mockResolvedValue(savedUser)

            const res = await userDao.findOneBy({name: name})

            expect(res).toEqual(savedUser)
            expect(User.findOne).toHaveBeenCalledWith({name: name})
        })
    })

    describe('findOneBy', () => {
        test('should return an user by address if the user exists', async () => {
            const address = 'some-address'
            const savedUser = {address: address, id:1}
            User.findOne = jest.fn()
            when(User.findOne).calledWith({address: address}).mockResolvedValue(savedUser)

            const res = await userDao.findOneBy({address: address})

            expect(res).toEqual(savedUser)
            expect(User.findOne).toHaveBeenCalledWith({address: address})
        })
    })
})