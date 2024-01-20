describe("master user internal", () => {
  it("positive test add new user internal", () => {
    cy.storageSet();
    cy.login();

    cy.visit("http://localhost:8080/master/user/add");

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

describe("master user internal", () => {
  it("negative test add new internal", () => {
    cy.storageSet();
    cy.login();

    cy.visit("http://localhost:8080/master/user/add");

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

    cy.contains("Data for this user already exists");

    cy.get("#nameSearch>.css-yk16xz-control")
      .click()
      .get(".css-26l3qy-menu")
      .type("Ezra")
      .wait(5000)
      .get(".css-26l3qy-menu")
      .should("be.visible")
      .find(".css-1n7v3ny-option")
      .first()
      .click();

    cy.get("button#saveBtn").click({ force: true });
    cy.contains("Please select a role");
  });
});

describe("master user internal", () => {
  it("positive test edit user internal", () => {
    cy.storageSet();
    cy.login();

    cy.visit("http://localhost:8080/master/user/edit/35");

    // cy.wait("@session");
    cy.wait(2500);

    cy.get(".custom-checkbox").eq(2).click();

    cy.get("button#saveBtn").click({ force: true });
    cy.contains("Yes").click();
    cy.contains("User updated successfully");
  });
});

describe("master user internal", () => {
  it("negative test edit user internal", () => {
    cy.storageSet();
    cy.login();

    cy.visit("http://localhost:8080/master/user/edit/35");

    // cy.wait("@session");
    cy.wait(2500);
    
    cy.get(".custom-checkbox").eq(2).click();
    cy.get(".custom-checkbox").last().click();

    cy.get("button#saveBtn").click({ force: true });
    cy.contains("Please select a role");
  });
});

describe("master user internal", () => {
  it("delete user internal positive test", () => {
    cy.storageSet();
    cy.login();

    cy.visit("http://localhost:8080/master/user");

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