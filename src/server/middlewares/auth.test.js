const auth = require("./auth");

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  verify: "",
}));

describe("Given the auth middleware", () => {
  describe("When it receives a request with the rigth token and a next function", () => {
    test("Then it should call the next function", () => {
      const req = {
        headers: {
          authorization: "Bearer rigth token",
        },
      };
      const next = jest.fn();

      auth(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  verify: jest.fn().mockReturnValue(new Error()),
}));

describe("Given the auth middleware", () => {
  describe("When it receives a request with the wrong token and a next function", () => {
    test("Then it should call next function with a custom error", () => {
      const req = {
        headers: {
          authorization: "wrong token",
        },
      };
      const next = jest.fn();
      const customError = new Error("Invalid token");
      customError.statusCode = 401;

      auth(req, null, next);

      expect(next).toBeCalledWith(customError);
    });
  });
});
