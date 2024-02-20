const userDao = require('../../dao/user')
const {UserError} = require("../../routes/user/UserErrors");

describe('UserDAO', () => {
    describe('create', () => {
        test('expect UserError when save user with invalid address', async () => {
            const user = {name: 'some-user', address: 'some-address', intro: 'some-intro'}

            await expect(userDao.create(user))
            .rejects
            .toBeInstanceOf(UserError)
        })
    })
})