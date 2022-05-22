const { compare } = require("bcrypt");
const { findOne } = require("../../database/models/User");
const { loginUser } = require("./UserControllers");

const mockUser = {
  name: "Kawaii Neko",
  username: "kawaiiNeko",
  password: "kawaiiNeko",
};
const mockToken = "uwuwuwuwu";

jest.mock("../../database/models/User", () => ({
  ...jest.requireActual("../../database/models/User"),
  findOne: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  ...jest.requireActual("bcrypt"),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  sign: () => mockToken,
}));

describe("Given the loginUser controller", () => {
  describe("When it receives a request with an existing user with correct password and a response", () => {
    test("Then it should call res' status and json with 200 and a token", async () => {
      findOne.mockImplementation(() => mockUser);
      compare.mockImplementation(() => true);
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const req = {
        body: {
          username: "kawaiiNeko",
          password: "kawaiiNeko",
        },
      };
      const expectedStatus = 200;
      const expectedToken = { token: "uwuwuwuwu" };

      await loginUser(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedToken);
    });
  });

  describe("When it receives a request with a non-existing user and a response", () => {
    test("Then it should call next function with a custom error 403 'Incorrect username or password'", async () => {
      findOne.mockImplementation(() => undefined);
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const req = {
        body: {
          username: "kawaiiNeko",
          password: "kawaiiNeko",
        },
      };
      const next = jest.fn();
      const expectedError = new Error("Incorrect username or password");
      expectedError.statusCode = 403;

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with anexisting user with an incorrect password and a response", () => {
    test("Then it should call next function with a custom error 403 'Incorrect username or password'", async () => {
      findOne.mockImplementation(() => mockUser);
      compare.mockImplementation(() => false);
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const req = {
        body: {
          username: "kawaiiNeko",
          password: "kawaiiNeko",
        },
      };
      const next = jest.fn();
      const expectedError = new Error("Incorrect username or password");
      expectedError.statusCode = 403;

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
