describe("master user internal", () => {
    it("positive test add new user internal", () => {
      cy.storageSet();
      cy.login();
  
      cy.visit("http://localhost:8080/master/intern/edit/");
  
      // cy.wait("@session");
      cy.wait(2500);
  
      cy.get("#nameSearch>.css-yk16xz-control")
        .click()
        .get(".css-26l3qy-menu")
        .type("Edwin Hans")
        .wait(5000)
        .get(".css-26l3qy-menu")
        .should("be.visible")
        .find(".css-1n7v3ny-option")
        .first()
        .click();
  
      cy.get(".custom-checkbox").last().click();
  
      cy.get("button#saveBtn").click({ force: true });
      cy.contains("Yes").click();
      cy.contains("Data saved successfully");
    });
  });