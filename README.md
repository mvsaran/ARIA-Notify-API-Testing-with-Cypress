# 🔔 ARIA Notify API Testing with Cypress

[![Cypress](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)
[![Accessibility](https://img.shields.io/badge/focus-accessibility-blue.svg)](https://www.w3.org/WAI/standards-guidelines/aria/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A comprehensive project demonstrating how to test the new ARIA Notify API using Cypress, featuring advanced testing techniques for accessibility features.

## 📋 Table of Contents

- [Overview](#overview)
- [Official Documentation](#official-documentation)
- [Demo](#demo)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Actual Tests](#actual-tests)
- [Project Structure](#project-structure)
- [Browser Support](#browser-support)
- [Author](#author)

## 🎯 Overview

This project demonstrates testing the **ARIA Notify API** - a new web standard that makes it easier to communicate live page updates to assistive technology like screen readers. The test suite showcases advanced Cypress testing techniques.

## 📚 Official Documentation

This project implements the concepts described in the official Cypress blog post:
[How to test the new ARIA Notify API with Cypress](https://www.cypress.io/blog/how-to-test-the-new-a-notify-api-with-cypress?utm_medium=blog&utm_source=social_media&utm_term=linkedin&utm_content=aria_notify_api)

## 🎥 Demo

Here is a recording of the actual tests running in Cypress:

<video controls src="cypress/videos/aria-notify.cy.js.mp4" width="100%"></video>

## 📦 Prerequisites

- **Node.js** (v14 or higher)
- **Chrome Beta** (recommended for native API support)

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd AriaNotifyAPI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 🧪 Running Tests

```bash
npm run test:chrome     # Run in Chrome
npm run test:headed     # Run in headed mode
npm run cy:open         # Open Cypress UI
```

## 📄 Actual Tests

Here is the complete working test suite used in this project:

```javascript
/**
 * ARIA Notify API Testing with Cypress
 */

describe('ARIA Notify API Testing', () => {
  
  it('should announce status updates when adding item to cart with mouse click', () => {
    // Visit local HTML file
    cy.visit('cypress/e2e/example-pages/buttons.html')
    cy.clock()

    let ariaNotifyStub

    // Stub the ariaNotify method
    cy.contains('button', 'Add to cart')
      .then($el => {
        ariaNotifyStub = cy.stub($el[0], 'ariaNotify')
      })

    // Click the button
    cy.contains('button', 'Add to cart').click()

    // Verify immediate feedback
    cy.wrap(null).then(() => {
      expect(ariaNotifyStub).to.have.been.calledWith('Adding item to cart...')
    })

    // Verify button is disabled
    cy.contains('button', 'Add to cart').should('be.disabled')

    // Fast-forward time
    cy.tick(2000)
      
    // Verify success message
    cy.wrap(null).then(() => {
      expect(ariaNotifyStub).to.have.been.calledWith('Added item to cart')
    })
  })

  it('should prevent double-clicks by disabling button during processing', () => {
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
    })

    // Button should be disabled
    cy.contains('button', 'Add to cart').should('be.disabled')
  })

  it('should handle multiple sequential interactions correctly', () => {
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
    })

    cy.tick(2000)
    
    // Check second message
    cy.wrap(null).then(() => {
      expect(ariaNotifyStub).to.have.been.calledWith('Added item to cart')
    })

    cy.contains('button', 'Add to cart').click()
    
    cy.wrap(null).then(() => {
      expect(ariaNotifyStub.callCount).to.equal(3)
    })
  })

  it('should verify the page has proper accessibility structure', () => {
    cy.visit('cypress/e2e/example-pages/buttons.html')

    cy.get('h1').should('contain', 'ARIA Notify API Demo')

    cy.contains('button', 'Add to cart')
      .should('be.visible')
      .and('not.be.disabled')

    cy.get('.info-box').should('exist')
    cy.get('html').should('have.attr', 'lang', 'en')
  })

  it('should verify button states change appropriately', () => {
    cy.visit('cypress/e2e/example-pages/buttons.html')
    cy.clock()

    cy.contains('button', 'Add to cart')
      .should('not.be.disabled')
      .should('not.have.class', 'loading')

    cy.contains('button', 'Add to cart').click()

    cy.contains('button', 'Add to cart')
      .should('be.disabled')
      .should('have.class', 'loading')

    cy.tick(2000)

    cy.contains('button', 'Add to cart')
      .should('not.be.disabled')
      .should('not.have.class', 'loading')
  })
})
```

## 📁 Project Structure

```
AriaNotifyAPI/
├── cypress/
│   ├── e2e/
│   │   ├── aria-notify.cy.js          # The tests shown above
│   │   └── example-pages/
│   │       └── buttons.html           # Example page with ARIA Notify
│   └── videos/                        # Test execution recordings
├── cypress.config.js                  # Cypress configuration
└── package.json                       # Dependencies
```

## 🌐 Browser Support

- ✅ **Chrome 141+** (Native support)
- 🔄 **Other Browsers** (Supported via included polyfill)

## 👨‍💻 Author

**Saran Kumar**
- LinkedIn: [www.linkedin.com/in/saran-kumar-a69775215](https://www.linkedin.com/in/saran-kumar-a69775215)

---

**⭐ If you found this project helpful, please consider giving it a star!**
