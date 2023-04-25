/* eslint-disable cypress/no-unnecessary-waiting */
describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      name: "Zedrick Torres",
      username: "pongbao",
      password: "michin-saekki",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users/`, user);
    const anotherUser = {
      name: "Son Chaeyoung",
      username: "ttalgi",
      password: "alcohol-free",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users/`, anotherUser);
    cy.visit("");
  });

  it("Login form is shown", function () {
    cy.contains("log in to application");
    cy.contains("username");
    cy.get("#username");
    cy.contains("password");
    cy.get("#password");
    cy.get("#login-button");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.contains("login").click();
      cy.get("#username").type("pongbao");
      cy.get("#password").type("michin-saekki");
      cy.get("#login-button").click();

      cy.contains("blogs");
      cy.contains("Zedrick Torres logged in");
      cy.contains("create new blog");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("pongbao");
      cy.get("#password").type("wrong");
      cy.get("#login-button").click();

      cy.get(".error")
        .should("contain", "invalid username or password")
        .and("have.css", "color", "rgb(255, 0, 0)")
        .and("have.css", "border-style", "solid");

      cy.get("html").should("not.contain", "Zedrick Torres logged in");
    });
  });
  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "pongbao", password: "michin-saekki" });
    });

    it("A blog can be created", function () {
      cy.contains("create new blog").click();

      cy.get("#blog-title").type("A blog created through cypress");
      cy.get("#blog-author").type("Zed");
      cy.get("#blog-url").type("www.blog-by-zed.com");
      cy.get("#create-blog").click();

      cy.contains("A blog created through cypress");
      cy.contains("Zed");
      cy.contains("www.blog-by-zed.com");
    });
    describe("and several blogs exist", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "first blog",
          author: "first author",
          url: "first-blog.com",
        });
        cy.createBlog({
          title: "second blog",
          author: "second author",
          url: "second-blog.com",
        });
        cy.createBlog({
          title: "third blog",
          author: "third author",
          url: "third-blog.com",
        });
      });
      it("it can be liked", function () {
        cy.contains("view").click();
        cy.contains("like").click();
        cy.contains(1);
      });
      it("it can be deleted by the user who created it", function () {
        cy.contains("view").click();
        cy.contains("remove").click();
        cy.get("html").should("not.contain", "first blog");
      });
      it("the remove button cannot be seen by users who did not create the blog", function () {
        cy.contains("logout").click();
        cy.login({ username: "ttalgi", password: "alcohol-free" });
        cy.contains("view").click();
        cy.get("html").should("not.have.class", "remove");
      });
      it.only("the blogs should be ordered according to the number of likes", function () {
        cy.get(".blog").eq(0).contains("view").click();
        cy.get(".blog").eq(0).contains("like").click();
        cy.wait(1000);
        cy.get(".blog").eq(0).contains("like").click();
        cy.wait(1000);
        cy.get(".blog").eq(0).contains("like").click();
        cy.wait(1000);
        cy.get(".blog").eq(0).contains("like").click();

        cy.get(".blog").eq(2).contains("view").click();
        cy.get(".blog").eq(2).contains("like").click();
        cy.wait(1000);
        cy.get(".blog").eq(1).contains("like").click();

        cy.get(".blog").eq(2).contains("view").click();

        cy.get(".blog").eq(0).should("contain", "first blog");
        cy.get(".blog").eq(1).should("contain", "third blog");
        cy.get(".blog").eq(2).should("contain", "second blog");
      });
    });
  });
});
