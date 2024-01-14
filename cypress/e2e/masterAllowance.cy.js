describe("master allowance", () => {
  it("positive test edit allowance", () => {
    cy.storageSet();
    cy.login();

    cy.visit("http://localhost:8080/master/allowance");
    cy.wait(2500);

    cy.get("button#editBtn").first().click({ force: true });

    cy.get("input#wfhAllowance").clear();
    cy.get("input#wfhAllowance").type("90000");
    cy.get("button#submitBtn").click({ force: true });

    cy.contains("Data Updated Successfully");
  });
});

describe("master allowance", () => {
  it("negative test edit allowance", () => {
    cy.storageSet();
    cy.login();

    cy.visit("http://localhost:8080/master/allowance");
    cy.wait(2500);

    cy.get("button#editBtn").first().click({ force: true });

    cy.get("input#wfhAllowance").clear();
    cy.get("button#submitBtn").click({ force: true });
    cy.contains("Must be greater than 0");
  });
});
