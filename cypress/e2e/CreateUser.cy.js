import {faker} from '@faker-js/faker'
import {constants} from "./constants";

describe('Create User API Test', () => {
    let userID
    let newUserID
    const token = constants.Bearer_token
    const header={
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const email = firstName + '.' + lastName + '@example.com'
    const Payload = {
        "name": 'Lili',
        "gender": "male",
        "email": email,
        "status": "active",
    }
    const firstname = faker.person.firstName()
    const lastname = faker.person.lastName()
    const newEmail = firstname + '.' + lastname + '@example.com'
    const updatedPayload = {
        "name": 'Anie',
        "gender": "female",
        "email": newEmail,
        "status": "active"
    }
        it('Should create a user and verify the response', () => {

            cy.request({
                method: 'POST',
                url: constants.baseURL,
                body: Payload,
                headers: header
            }).then((response) => {
                expect(response.status).to.eq(201)
                expect(response.body.name).to.eq('Lili')
                expect(response.body.gender).to.eq('male')
                expect(response.body.email).to.eq(email)
                expect(response.body.status).to.eq('active')
                expect(response.body).to.have.property('id')
                userID = response.body.id
                cy.log(`User created with ID: ${userID}`)
            })
        })

    it('should get the user details and verify creation', () => {

        cy.request({
            method: 'GET',
            url: `${constants.baseURL}/${userID}`,
            headers:header

        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.name).to.eq('Lili')
            expect(response.body.email).to.eq(email)
            expect(response.body.status).to.eq('active')
            expect(response.body).to.have.property('id')
            userID = response.body.id
            cy.log(`User created with ID: ${userID}`)
        })
    })

    it('Should update user details and verify', () => {
        cy.request({
            method: 'PATCH',
            url: `${constants.baseURL}/${userID}`,
            headers:header,
            body: updatedPayload,

        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.name).to.eq('Anie')
            expect(response.body.email).to.eq(newEmail)
            expect(response.body.status).to.eq('active')
            expect(response.body).to.have.property('id')
            newUserID = response.body.id
            cy.log(`User created with ID: ${newUserID}`)

        })
    })
    it('Should get and verify the updated user details', () => {
        cy.request({
            method: 'GET',
            url: `https://gorest.co.in/public/v2/users/${newUserID}`,
            headers:header,
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.name).to.eq('Anie')
            expect(response.body.email).to.eq(newEmail)
            expect(response.body.status).to.eq('active')
            expect(response.body.id).to.eq(newUserID)
            newUserID = response.body.id
            cy.log(`User created with ID: ${newUserID}`)
        }).then(() => {
            cy.request({
                method: 'GET',
                url: `${constants.baseURL}/${newUserID}`,
                headers:header,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.name).to.eq('Anie')
                expect(response.body.email).to.eq(newEmail)
                expect(response.body.status).to.eq('active')
                expect(response.body).to.have.property('id')
                userID = response.body.id
                cy.log(`User created with ID: ${userID}`)
            })
        })
    })
    it('Should delete the created user', () => {
        cy.request({
            method: 'DELETE',
            url: `${constants.baseURL}/${newUserID}`,
            headers: header,
        }).then((response) => {
            expect(response.status).to.eq(204)
        })
    })
    it('Should verify the user is deleted', () => {
        cy.request({
            method: 'GET',
            url: `https://gorest.co.in/public/v2/users/${newUserID}`,
            headers: header,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
        })
    })
})






