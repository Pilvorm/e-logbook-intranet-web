// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import "cypress-file-upload";
import "cypress-localstorage-commands";

Cypress.Commands.add("login", () => {
  cy.intercept("/api/auth/session", { fixture: "session.json" }).as("session");

  // Set the cookie for cypress.
  // It has to be a valid cookie so next-auth can decrypt it and confirm its validity.
  // This step can probably/hopefully be improved.
  // We are currently unsure about this part.
  // We need to refresh this cookie once in a while.
  // We are unsure if this is true and if true, when it needs to be refreshed.

  cy.setCookie(
    "next-auth.session-token",
    "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..gDrEcLIsVV5sN6eX.E0pq4kQ7VtlxOR4rc7ZtByRSpEO6Idqfj3sI9o-M-s0D6zHCnbRXGGc_OLasT4VgwydcRgc5RjHXF6PMaR8JfGLxIv8Z5RevUI3PPkYOA0OThzfMlo2z32zssTjHY-Kmdyw1znA53UTr1uxR_3_-zlkBH3fXySnWbXuy4cybWQZpcins1D7qqvLr6bPSy1N2W4bvLXQE0e2FLQGwO5Xvi6ED_CLoWBuFJNaBep3X_HAC1JH2MQBMIlDk4tungOfWL0RAxYyteqItvblGaDrmqIDTkeeMcw0Wz1fsA2ObEYqBqAk9kqzVLNQjWulFQn64HSsoCGMh8I4ISAAkpsCkBBLJcyfGEoFzW4ZR4n8MUjaRdv7Qzir1AAn7z0wTS00EHzYXdkFgb1WpWeD74fx6PxKUWLcItcvi1x8tUinnvyS_LlZW8CjSrsQ1tTGERPNoPeh222luUDYRevL6tbcHY0SiEkmUJezOw-UepbfpPY7ebLlHwYUuA95IBi2NC7raU4mJSSbGHN0_-JUbskczKzW1VNbXSRtdtMwbZ7HQS5Yb4sZiIbICT7jX0MhEWzVKQE0tcussgGnWMr-zScMWzWbv2EIvR0uFXaaPhvbdLpAljzld2hFRuJ3aSgsJGVZBMD0jv7H9GvAN0bpZZEdQuxuZ9yA9xSrddqh1a_Vzxq9RGL4Hdl9a8pEyH1o5baGXkBndZp9Xf7TGlBupSm3RdrFg8aACrxvqgAHBQanmqbCpSEO5XEhLsCjXYRfLrojBGpWMjsGiScguMdZBDOggbNpnmGWylE-xpVmLqelhFs8yk7xuQCqglddfrPXdkfwV778Xz-LtCbtTufwwArCZxVCU6orcIxZ27C3XSIOQluO5_K5aNs6NPS7GAj_ZN8UaICN3G8nSTP84z5Fg8WOY_lgkrU_pBpsIxalUIDDItmTsIFLl9IKXb4oJ8fbnW4j4Nt9v6Vq8R3qOa3_eNan80PDigNOPjOEsIpVPvqkQKUr6wbm6MQXaglUCUvDo1PZBfHkkb54kysPb5ffyWuFHxK5DCIUTIZDqtGykVWKXHvxdTq9cpFTi_IuxW0rF6vXsbT0U2EB2T6lddmagx7iijnxG94h0nGeKxsV8xlL1pwpYK0d3kENQuJ56kWm31H7w5IEiC5LLCe1eHghh2GR0Xgl-uUyDA2tiK8vVi1U7q8QaTSLNQI28qp8EvawKHvh5JIm7nPUH1S1TLnimTuo4yrxVKBWqH2zpO6ydQ8SLZLRdr7KeGMVVsCCHiCnTMRHjbnpjCcBgkewuAvXBqBg5rGcpcdcSe8E7wCkws4kR9bf3BgvBMdtvK3LGX_zVJiPtB73mgsso2o0buW_UUylrLqkQWFnnjsPnOpTBN7kl-MtYZwtDnX4DD2SUSF9ClP19kwh3IswqRJRVZSK8Bhl9XzUaIHb8l_RI8AhRdxyen_FbXlw-80jeJlKTXTJc5fe1ouncfvBhpKmO56AcsIYFCtauLWNYoywoVDyiVwTeMaYz2FZDcbbHDCDJaA6aFWmXwZ2BQVO_lGPHtmZZjFXSXuhRJuUu-0w5PI16rnONqeVNnSz_jEEWhqVEglTy-_ESGRbm-CQn6qDNRPO-Baci7yFJArcJG2D0m0r0p1N4QiQt3yosh792SKc80hjNJHy7z6zwNJ1WcaO70t6UyW9yXEP9hE5J4iudnVbLC8R8rIR5J7ZeDxreIV12MselA4fblPk.sjm-yFCVjMHUYliDuJCbGg"
  );

  Cypress.Cookies.preserveOnce("next-auth.session-token");
});

Cypress.Commands.add("storageSet", () => {
  cy.window().then((win) => {
    win.localStorage.setItem(
      "userRoles",
      JSON.stringify(["MENTOR", "HR", "ADMIN",])
    );
  });
});

// Cypress.Commands.add("storageSet", () => {
//   cy.setLocalStorage("flagRole", "true");
//   cy.setLocalStorage(
//     "userRoles",
//     JSON.stringify([
//       {
//         nik: "user.one",
//         userPrincipalName: "user.one@kalbe.co.id",
//         email: "user.one@kalbe.co.id",
//         roleCodeOld: "ESELECTION-ADMIN",
//         roleCode: "ESELECTION-ADMIN",
//         roleName: "HRD-Admin",
//         applicationCode: "E-SELECTION",
//         companyCode: "1",
//         jabatan: "-",
//         notes: "Role CRUD module masterasdzz",
//         isActive: true,
//         createdDate: "2023-03-23T00:00:00",
//         createdBy: "hanif.mahadika@kalbe.co.id",
//         updatedDate: "2023-03-31T14:22:47.567",
//         updatedBy: "User One",
//         orgType: null,
//         clusterCode: null,
//         companyName: null,
//         name: "User One",
//       },
//     ])
//   );
//   cy.setLocalStorage(
//     "currentUserSite",
//     JSON.stringify({
//       Id: "18dc8e9c-9e49-4c61-abd1-2bc2ba631bd1",
//       Nik: "0001",
//       UserPrincipalName: "user.one@kalbe.co.id",
//       ApplicationCode: "E-SELECTION",
//       CompanyCode: "01",
//       ClusterCode: "KF",
//       CompanyName: "PT. Kalbe Farma Tbk.",
//       IsDeleted: false,
//       CreatedDate: "2023-05-09T00:00:00",
//       CreatedBy: "hanif.mahadika@kalbe.co.id",
//       UpdatedDate: "2023-05-09T00:00:00",
//       UpdatedBy: "hanif.mahadika@kalbe.co.id",
//       IsDefault: true,
//     })
//   );
//   cy.setLocalStorage("currentUserRole", "HRD-Admin");
// });
