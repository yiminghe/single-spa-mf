import config from '../../cypress.json';

describe('single-spa-mf', () => {
  it('main app works', () => {
    cy.visit('/');
    cy.get('#single-spa-application\\:main').contains('home');
    cy.get('[data-href="/intro"]').click();
    cy.url().should('to.equal',`${config.baseUrl}/intro`);
    cy.get('#single-spa-application\\:main').contains('intro');
    cy.visit('/');
    cy.get('#single-spa-application\\:main').contains('home');
  });

  it('app1 works',()=>{
    cy.visit('/');
    cy.get('[data-href="/app1"]').click();
    cy.url().should('to.equal',`${config.baseUrl}/app1`);
    cy.get('#single-spa-application\\:main').should(($el)=>{
      expect($el[0].innerHTML).to.equal('');
    })
    cy.get('#single-spa-application\\:app1').contains('app1 home');

    cy.get('.app1-home-intro').click();
    cy.url().should('to.equal',`${config.baseUrl}/app1/intro`);
    cy.get('#single-spa-application\\:app1').contains('app1 intro');


    cy.get('.app1-intro-home').click();
    cy.url().should('to.equal',`${config.baseUrl}/app1`);
    cy.get('#single-spa-application\\:app1').contains('app1 home');


    cy.get('.app1-home-none').click();
    cy.url().should('to.equal',`${config.baseUrl}/app1`);
    cy.get('#single-spa-application\\:app1').contains('app1 home');


    cy.get('.home-none').click();
    cy.url().should('to.equal',`${config.baseUrl}/`);
    cy.get('#single-spa-application\\:app1').should(($el)=>{
      expect($el[0].innerHTML).to.equal('');
    });
    cy.get('#single-spa-application\\:main').contains('home');
  });

  it('notFound works',()=>{
    cy.visit('/');
    cy.get('[data-href="/notFound"]').click();
    cy.get('#single-spa-application\\:notFound').contains('error when loading');
  });
});