const express = require('express')
const router = express.Router()
const path = require('path')
const employeesControllers = require('../../controllers/employeeControllers')
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middlewares/verifyRoles')

router.route('/')
    .get(employeesControllers.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesControllers.addEmployees)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesControllers.updateEmployees)
    .delete(verifyRoles(ROLES_LIST.Admin), employeesControllers.deleteEmployees)

router.route('/:id')
    .get(employeesControllers.getEmployees)

module.exports = router