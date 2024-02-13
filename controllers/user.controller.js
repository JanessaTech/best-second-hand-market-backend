const {Student} = require('../db')
const logger = require("../helpers/logger");

class UserController {

    /**
     * Register a user which is associated with a wallet address
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async register(req, res, next) {

        try{
            const stu1 = await Student.findOne({'name' : 'student1'})
            .populate('teachers')
            .exec()
            console.log('stu1:', stu1)
        }catch(error) {
            console.log('failed to find student1 due to:', error)
        }
    
        try{
            const stu2 = await Student.findOne({'name' : 'student2'})
            .populate('teachers')
            .exec()
            console.log('stu2:', stu2)
        }catch(error) {
            console.log('failed to find student2 due to:', error)
        }
        try{
            const stu3 = await Student.findOne({'name' : 'student3'})
            .populate('teachers')
            .exec()
            console.log('stu3:', stu3)
        }catch(error) {
            console.log('failed to find student3 due to:', error)
        }
    }

    /**
     * Get the user which is associated with a wallet address
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getUserByWalletAddress(req, res, next) {

    }

    /**
     * Login by wallet address, return the user info
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async login(req, res, next) {

    }

    /**
     * Logout for an user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async logout(req, res, next) {

    }

    /**
     * Get an overview of a user by id
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getOverViewById(req, res, next) {

    }

    /**
     * Update user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async update(req, res, next) {

    }
}

const controller = new UserController()
module.exports = controller