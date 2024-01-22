describe("upload autograph", () => {
  it("positive test upload autograph", () => {
    cy.storageSet();
    cy.login();

    cy.visit("http://localhost:8080/internship");

    // cy.wait("@session");
    cy.wait(2500);

    cy.get("button#autographBtn").click({ force: true });
    cy.get('#custom-file').selectFile('TTD.png');

    cy.get("button#saveBtn").click({ force: true });
    cy.wait(3500);
    cy.contains("Data saved succesfully");
  });
});

describe("upload autograph", () => {
    it("negative test upload autograph", () => {
      cy.storageSet();
      cy.login();
  
      cy.visit("http://localhost:8080/internship");
  
      // cy.wait("@session");
      cy.wait(2500);
  
      cy.get("button#autographBtn").click({ force: true });
  
      cy.get("button#saveBtn").click({ force: true });
      cy.wait(3500);
      cy.contains("Must be filled");
    });
  });