// describe("master intern", () => {
//   it("positive test confirm new intern", () => {
//     cy.storageSet();
//     cy.login();

//     cy.visit("http://localhost:8080/master/intern/edit/24");

//     // cy.wait("@session");
//     cy.wait(2500);

//     cy.get("button#confirmBtn").click({ force: true });

//     cy.contains("Yes").click();
//     cy.wait(3500);
//     cy.contains("User confirmed succesfully");
//   });
// });

describe("master intern", () => {
  it("positive test edit intern", () => {
    cy.storageSet();
    cy.login();

    cy.visit("http://localhost:8080/master/intern/edit/25");

    // cy.wait("@session");
    cy.wait(2500);

    cy.get("#nameSearch>.css-yk16xz-control")
      .click()
      .type("Emir Haikal")
      .wait(5000)
      .get(".css-1w9j89e-menu")
      .should("be.visible")
      .find(".css-1n7v3ny-option")
      .first()
      .click();

    cy.get("button#saveBtn").click({ force: true });
    cy.contains("Yes").click();
    cy.contains("Data updated successfully");
  });
});

describe("master intern", () => {
  it("negative test edit intern", () => {
    cy.storageSet();
    cy.login();

    cy.visit("http://localhost:8080/master/intern/edit/25");

    // cy.wait("@session");
    cy.wait(2500);

    cy.get("input#endDate").click({ force: true });
    cy.get("span.flatpickr-day").contains("22").click({ force: true })

    cy.contains("End date can't be before join date")
  });
});

describe("master intern", () => {
  it("positive test delete intern", () => {
    cy.storageSet();
    cy.login();

    cy.visit("http://localhost:8080/master/intern");

  //   cy.wait("@session");

    cy.wait(2500);

    cy.get("button#optionsSelect")
      .first()
      .click({ force: true })
      .get("button#deleteBtn")
      .first()
      .click()
      .get(".swal2-content").contains('Yes')
      .click()
    cy.contains("Successfully deleted user");
  });
});