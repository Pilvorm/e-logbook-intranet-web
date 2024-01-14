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
    "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..BGE-SEJOohWUHWC1.p5YWmdvJw-rWDWf3iQaaQsu-RZz8EDkxQdO_xubdvARBgsnO3Bvh3xEaukViQO4cnZvSqG1yCFmVYuR2Y53QqclCeBAJ34W_xYhcCfzJNhLO_oqXbq9fQ6D8TcUAAxSNDbhKgCEjJFc81w2dLV6QAKefT1TzU9JyoBdUQPFSKe-yDNf1F41vLAQwSWFa2Nu0kkiMEQ9f9S0J0YoDCfk74AxyhlV_UdmSVVs63cpurxJ8LYDddVnoqXbcqQdjQqeSgeNnR9x-ZgStkXmLX-9KfVdKXA8sWPNHGZ-JgFneFWFi6Hc0NpJeFQQJDL9Qzs9C1vKmLhMxqdxwkDdS8lOerqSLTd24Neap7pOFzrtLeLiGTF-dqc4pweso8zfNxAENTH7EnXxZRVsBDPkJVCkIB5CiCXF5qezgmFciOAhcPrw7WWDDVu20nhbCJLKVw6C7oNUspQA5atHiubzolHtW14xcny24_ggxpe4CDGPS6dWijxgDYllxsyiGPfAy_e-uR_F4d_u9GfFTOq0q-mhC_hGNBwZHz91OsiMP46rUEKk78XW2c_OOXEnT45g8DUDBjOxhgmwAJhlDYO954zc9u_x_DKDG5DtIwphr_tyCXskcgVChSgsu373bF8wK2YlTfR6-8PyYgWzCteX7oxJcCcCxx7BHl35G5IezAIWztJ1kyBJAW827M5WSAEBJyuupFhTtWIatoq5dzqDxkVt7Fx-hnJuClyLq9tzO8hyXEJuasQxbUCr8NJJZRai8QmVkNbCHtJ-av6v9al0uEVypJxGviBsd5D2-6P6j0xBH6YDubO4uIawTLm1hCCzaB8980QwrpFuY3pfYMnQH5LyETVKEU0ZjwjuJlyz-5EdsK15n3OrsuB1-7XIuuPmbR9i1EMZc8-QsrERMS8pUM7FfjU3l1TsL7Ht3_BGP-1O8kQwMbVeXlqkiNsegWijhoSW4LtWS6qud4Euh52tqbZEuIymVZlv2skdJ0t4FFBRSV_CBx_OINpO8UPZBRhGSsXERh6Um6gwqJzH2KnJrFrmodAvUb_VTp9muB23r6pGJXy2tr3hxmJLSeb7lTHb7-NkJchyiQNfAlsfh0RFFGfRBvmaA529pU614yGXgpVOizLBBXvutHdK3tv-CtwONlIiBp8HtpoRtYuwn5Ipa_4aq0YdEhJFaob0aVypgHNjS4POHrvFKfKUpNgtZMt1j0J2e3EYiRLU7U1WwJeAQw_kcb_xqdSm5D6PE9cdbe-dnV5Bm76Zjs5PhgZ23eqs0wB4Tb52foB3oV5a1dxMTeW7mpiytSuY26VBHujkfIqThpyiX7Le2GhLJpWFWOvPbxDpoO4BkiVgrTYglS6vlxdQNNP-Vseqab6fqGygf2iJWUBvX1m6CFnL-kE-baOdEVwOL-Wo1xQRCeCxfYBbMpO3gsLMn9DlWp231FAk5tx8QAvOcZJbmbxE9LlfIsOc37PNA1JsNMklnEDwiAcI-wJrXbPUkKiCiBvWGTZCtEL2ZDKJQm4pigQyak8-km8wE1XPCG6YuHwMXvKdYiHvNkFRsongvEyQdZkePj6KKi1tTi-JMCwVRtR6LUmWTKSZcOut1YzgexVzPxDY-SyvrcBM6uPoszHi5q-O1gK6ZzXzyUlXgONw3GqgDlOrLpomP0YQJb9jvMliV-53bgwfsVAxV7HrvXDHREqlgGxfXyFPNBY3_Yg5VqFRZQ_DRJwFz3E0FF42ofTsJ2kgJVdao-m3LIASw9Zvck8v-L_OchvVqBznXWphkKUdhj2mq2iPsJsg_OJjNX5e_XY7HnpLyxqgVRT6N745NsrQuGQ4ELipt0oHj4SZdgswLyanOaTTRs_qV1XIpz8drQmnmtJNlrtZuMP8tAQ3s7Ykec_nv7x6TeZfqhOueyVOVfvI1N3yriXjz0MALhaIH0SdqbD1XhcHp6hkxtJ5Qv6PDbYrivEHkI5EFGnuCGfMuxG5rjcB49lnGU2d5m87928cAkC5bLMknjV7-f0x7d_4Nc23Mlm9_pzA-8lVu3RAg7bMZ2Lg1ff3Hy8BSGfA7pIaoKDwF.P4pn2899qAI7eFmzOIO3QQ"
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
