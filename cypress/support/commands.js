// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Custom command to stub ariaNotify on an element and create an alias
 * This simplifies the test code by combining common operations
 * 
 * @example
 * cy.get('button').stubAriaNotify('myStub')
 * cy.get('@myStub').should('have.been.calledWith', 'message')
 */
Cypress.Commands.add('stubAriaNotify', { prevSubject: 'element' }, (subject, aliasName = 'ariaNotifyStub') => {
    cy.wrap(subject).then($el => {
        cy.stub($el[0], 'ariaNotify').as(aliasName)
    })
    return cy.wrap(subject)
})

/**
 * Custom command to verify ariaNotify was called with a specific message
 * 
 * @example
 * cy.verifyAriaNotify('@myStub', 'Expected message')
 */
Cypress.Commands.add('verifyAriaNotify', (aliasName, expectedMessage) => {
    cy.get(aliasName).should('have.been.calledWith', expectedMessage)
})

/**
 * Custom command to activate a button using keyboard
 * Combines focus + keypress into a single command
 * 
 * @example
 * cy.get('button').activateWithKeyboard('space')
 */
Cypress.Commands.add('activateWithKeyboard', { prevSubject: 'element' }, (subject, key = 'space') => {
    const keyMap = {
        space: Cypress.Keyboard.Keys.SPACE,
        enter: Cypress.Keyboard.Keys.ENTER
    }

    cy.wrap(subject).focus()
    cy.press(keyMap[key.toLowerCase()] || keyMap.space)

    return cy.wrap(subject)
})

// Example of overwriting an existing command
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
//   // Add custom behavior before visiting
//   return originalFn(url, options)
// })
