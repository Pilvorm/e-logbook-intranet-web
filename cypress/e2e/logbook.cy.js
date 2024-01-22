// describe("logbook", () => {
//   it("negative and positive test revise", () => {
//     cy.storageSet();
//     cy.login();

//     cy.visit("http://localhost:8080/internship/logbook/21?month=December+2023");

//     // cy.wait("@session");
//     cy.wait(2500);

//     cy.get("button#reviseBtn").click({ force: true });
//     cy.contains("Yes").click();
//     cy.get("button#okConfirm").click({ force: true });
//     cy.contains("Must be filled").click();
    
//     cy.get("textarea[name=notes]").type('Cypress Revision');
//     cy.get("button#okConfirm").click({ force: true });

//     cy.wait(3500);
//     cy.contains("Revision request sent successfully");
//   });
// });

describe("logbook", () => {
    it("positive approve revise", () => {
      cy.storageSet();
      cy.login();
  
      cy.visit("http://localhost:8080/internship/logbook/21?month=December+2023");
  
      // cy.wait("@session");
      cy.wait(2500);
  
      cy.get("button#approveBtn").click({ force: true });
      cy.contains("Yes").click();
  
      cy.wait(10500);
      cy.contains("Logbook approved succesfully");
    });
  });