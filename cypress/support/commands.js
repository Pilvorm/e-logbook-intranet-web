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
    "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..HjVjlg0QRhoA2xQ8.Ef51ofrji17sweCnzWTO6ilDKLNd03xmgZDIvRY3CnaAzlhps9EtFRTJudkP_RPyHSh0sV5HH7U2mCaQD7NNBOeNSuHXIcW5pio1VUzXtTZWoVcrLW5Ab3QjUSs7pspapGc_P0_aL2dT_n1yhcLHwRaIOxKDiMytBhmVrzNVuDevfSPpbiN40_sp0DdK2YUi8-mtV5hajHMl9-4jppTJ_nlzlTdjaahQ-xKrq0Z6BxgWa15L3vxgBF06Brp3S-W_pZhfJ9SCiXRxhc7X19zAeGVI8PqWhQgew46m7Hm2mQWp0_T9GW9IjBR3MnhIitji-2tIY71jA5Y8Wy_N_M_NbVt84cFEpAeCE-sF_x4J5ENREymYmFaCrM_C9BNCO6m5iCXMkdj8-7HBHYpODy6BTYR6CljqH3ojUsFXTHai4KDe8zwOxGTidj6pm4ZTI6D8Syn5Jm_iNS5rpxpsgErptAm_EjUpacZ64aTJ3u4GoYOaa-mUsTY8O-ZaEOGtWhtqNZb43_KLvG0X-yJNDRN7M8mIk55hHMKQFppdmDP7_2Zc8o0zioLIxdPwWOWbMnXAPhdGZ5cfbdw5i3bZLyxYVkNL2DJiH444meRC097wivGjMCBdv2hAUbi42b2rFPLfJf7f4MAuBwQdfI1cwzhVBWbmiZmr2ql-vzkBpsxHvJb91E5EZYdgjAVHQLlRu3StsPtnVe_MhoL3I8gF2H9V0J6dJBaatwAdfkBS6zwgbgsQU6X0by_QqpHkeJ2TvPVNiErNKPjVqAF5QFuzzTecghMwQ1ECWqRE4huxwHPMN3kcsFknNQYRtzvfSuQkECX7R04q2cIkVzvRy9SL79gofXRBsGZV19byoW4Xdxh0mZI0oEPFBPYV9TzJyTSw-0QpXp4CzxFxXiz1GCvxVzwFwRsBboAkab1rgCMKmtWaCEfu8NTlHRXYZVsS5DnXWsbhQVYCsGpebLT2qgui-vlkif4KjtwzabKyQwg9W-3r3GSvH9Q8tYmAdxj51pk0BWQ1TVD0QSxP4vIJqOqt4pClAET0bykIMNEYxiVJoKTpMwOc4zv4mb1lw9EWulKSfN_bMV2u3AKo4bHMBVcd1rViVhVsfSB85Og4UBU7AlrTYqnX2GbvZmuNkkwanNLlmM0RTjcoHT95XpFYPK1eaCWatc5oECzdVGt4PCeW-_Pn24TMLhyz7KEmkEOEe5r2k7q-jeAj8NYSLFroZ845kpV5YDHjp6nxQ2FhQd2RB6UahQRdFd6Bs5QhvbSZyAS-2XpEs94_u5LacK93YmcRJEuR57VW0IKDiM1UObuh7WIOPOBrGmNuwKSecOF5-KxwmaMx83iU26Ae7NgoZ_HrsXk78kDQ7FGjsO0eaapDZiiUpFV45tw7ZgoE_3rv6jvT23G8Luyg0BY5fGLimq7UubSXpxU6yYujm3ffXkV0yJ-KlrSymD4BmUvnLv6KSufDbHG4mcBv6uA7AEkaHRATjSSdCG9HfJYWfujRqCU1i4ZOyy3Xsvao7gvESXDYIqFkSXnkHgCyw2Nf3Nu9ovP2qcxzEITTPVT7ug_HzEEEJzX5hPrkreEmUsKtbXIZuctf06DE9UkyEbKhjUe-MlyInltPA8GgNSGnhgu7fVKxtIhGxy-VR-_SYVFbRVzXp_rN3fKT7fIGCjabEYyv3rRiMD-VKc4LzVF6FTKp-hdU5nbUGt71yecpjJvM49Hhdg_4PgS995Y.sSspegHnVYN3PnsFabJ1-A"
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
