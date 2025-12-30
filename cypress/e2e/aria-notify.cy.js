/**
 * ARIA Notify API Testing with Cypress
 * 
 * This test suite demonstrates advanced Cypress testing techniques:
 * 1. Testing local HTML files without a server
 * 2. Using cy.clock() to control time in tests
 * 3. Stubbing methods on specific DOM elements
 * 4. Verifying accessibility announcements
 * 5. Testing multiple interactions and edge cases
 */

describe('ARIA Notify API Testing', () => {

    it('should announce status updates when adding item to cart with mouse click', () => {
        // ============================================
        // ARRANGE - Set up the test environment
        // ============================================

        // Visit the local HTML file
        // Cypress can serve local files directly without needing a web server
        cy.visit('cypress/e2e/example-pages/buttons.html')

        // Take control of the browser's clock
        // This allows us to fast-forward through delays without actually waiting
        cy.clock()

        // Create a variable to store our stub
        let ariaNotifyStub

        // Find the button and stub its ariaNotify method
        // We stub the method so we can verify it's called with the correct messages
        // without actually triggering screen reader announcements
        cy.contains('button', 'Add to cart')
            .then($el => {
                ariaNotifyStub = cy.stub($el[0], 'ariaNotify')
            })

        // ============================================
        // ACT - Perform the user interaction
        // ============================================

        // Click the button to trigger the handler
        cy.contains('button', 'Add to cart').click()

        // ============================================
        // ASSERT - Verify immediate feedback
        // ============================================

        // Verify immediate feedback - the "processing" message
        // This confirms immediate feedback is provided to screen reader users
        cy.wrap(null).then(() => {
            expect(ariaNotifyStub).to.have.been.calledWith('Adding item to cart...')
        })

        // Verify button is disabled during processing
        cy.contains('button', 'Add to cart').should('be.disabled')

        // ============================================
        // ASSERT - Verify delayed success message
        // ============================================

        // Fast-forward time by 2000ms (2 seconds)
        // This simulates the server response delay without actually waiting
        cy.tick(2000)

        // Verify success message after the delay
        // This confirms the user is notified when the operation completes
        cy.wrap(null).then(() => {
            expect(ariaNotifyStub).to.have.been.calledWith('Added item to cart')
        })

        // Verify button is re-enabled after processing
        cy.contains('button', 'Add to cart').should('not.be.disabled')
    })

    it('should prevent double-clicks by disabling button during processing', () => {
        // Test that the button properly prevents rapid clicks
        cy.visit('cypress/e2e/example-pages/buttons.html')
        cy.clock()

        let ariaNotifyStub

        cy.contains('button', 'Add to cart')
            .then($el => {
                ariaNotifyStub = cy.stub($el[0], 'ariaNotify')
            })

        // First click
        cy.contains('button', 'Add to cart').click()

        // Verify first message
        cy.wrap(null).then(() => {
            expect(ariaNotifyStub).to.have.been.calledWith('Adding item to cart...')
        })

        // Button should be disabled, preventing accidental double-clicks
        cy.contains('button', 'Add to cart').should('be.disabled')

        // Even if we try to click again, it won't work because button is disabled
        // This is good UX - prevents duplicate submissions
    })

    it('should handle multiple sequential interactions correctly', () => {
        // Test that multiple clicks work correctly when done sequentially
        cy.visit('cypress/e2e/example-pages/buttons.html')
        cy.clock()

        let ariaNotifyStub

        cy.contains('button', 'Add to cart')
            .then($el => {
                ariaNotifyStub = cy.stub($el[0], 'ariaNotify')
            })

        // First click
        cy.contains('button', 'Add to cart').click()

        cy.wrap(null).then(() => {
            expect(ariaNotifyStub).to.have.been.calledWith('Adding item to cart...')
            expect(ariaNotifyStub.callCount).to.equal(1)
        })

        // Complete first operation
        cy.tick(2000)

        cy.wrap(null).then(() => {
            expect(ariaNotifyStub).to.have.been.calledWith('Added item to cart')
            expect(ariaNotifyStub.callCount).to.equal(2)
        })

        // Button should be enabled again
        cy.contains('button', 'Add to cart').should('not.be.disabled')

        // Second click should now work
        cy.contains('button', 'Add to cart').click()

        cy.wrap(null).then(() => {
            expect(ariaNotifyStub.callCount).to.equal(3)
        })

        cy.tick(2000)

        cy.wrap(null).then(() => {
            expect(ariaNotifyStub.callCount).to.equal(4)
        })
    })

    it('should verify the page has proper accessibility structure', () => {
        // Verify the page has the expected structure and accessibility features
        cy.visit('cypress/e2e/example-pages/buttons.html')

        // Check for proper heading structure (important for screen readers)
        cy.get('h1').should('contain', 'ARIA Notify API Demo')

        // Verify the button has accessible text (not just an icon)
        cy.contains('button', 'Add to cart')
            .should('be.visible')
            .and('not.be.disabled')

        // Check that informational content is present
        cy.get('.info-box').should('exist')

        // Verify the page has a language attribute (helps screen readers)
        cy.get('html').should('have.attr', 'lang', 'en')
    })

    it('should verify button states change appropriately', () => {
        // Test the visual feedback states of the button
        cy.visit('cypress/e2e/example-pages/buttons.html')
        cy.clock()

        // Button should start enabled
        cy.contains('button', 'Add to cart')
            .should('not.be.disabled')
            .should('not.have.class', 'loading')

        // Click the button
        cy.contains('button', 'Add to cart').click()

        // Button should be disabled and have loading class
        cy.contains('button', 'Add to cart')
            .should('be.disabled')
            .should('have.class', 'loading')

        // After delay, button should be enabled again
        cy.tick(2000)

        cy.contains('button', 'Add to cart')
            .should('not.be.disabled')
            .should('not.have.class', 'loading')
    })
})
