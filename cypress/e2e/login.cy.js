describe("login type", () => {
  it("positive test login", () => {
    const username = "";
    const password = "";

    cy.viewport(1280, 800);

    cy.visit("http://localhost:8080/auth");

    cy.get("input#username").type(username);
    cy.wait(1000);
    cy.get("input#password").type(password);
    cy.wait(1000);

    //   cy.get('#Login').click();
    cy.get("button").contains("Login").click();
    cy.wait(10000);

    // Verify the redirection to the expected URL
    cy.url().should("include", "http://localhost:8080/home");
  });
});

describe("Login to App Failed", () => {
  it("Login Fail show error message", () => {
    cy.visit("http://localhost:8080/auth");
    cy.wait(2000);

    cy.get("input#username").type("wrong@kalbe.co.id");
    cy.wait(1000);
    cy.get("input#password").type("Kalbefarma");
    cy.wait(1000);

    //   cy.get('#Login').click();
    cy.get("button").contains("Login").click();
    cy.wait(7000);
  });
});
