// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add custom configuration for ARIA Notify testing
Cypress.on('window:before:load', (win) => {
    // You can inject polyfills or other setup code here if needed
    // For example, you could inject the ariaNotify polyfill
    // if you want to test in browsers that don't support it natively
})

// Suppress specific console warnings during tests
Cypress.on('window:before:load', (win) => {
    const originalWarn = win.console.warn
    win.console.warn = (...args) => {
        // Filter out ariaNotify polyfill warnings during tests
        if (args[0] && args[0].includes('ariaNotify is not supported')) {
            return
        }
        originalWarn.apply(win.console, args)
    }
})
