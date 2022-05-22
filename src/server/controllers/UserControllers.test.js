const { compare } = require("bcrypt");
const { findOne, create } = require("../../database/models/User");
const { loginUser, registerUser } = require("./UserControllers");

const mockUser = {
  name: "Kawaii Neko",
  username: "kawaiiNeko",
  password: "kawaiiNeko",
};
const mockToken = "uwuwuwuwu";

jest.mock("../../database/models/User", () => ({
  ...jest.requireActual("../../database/models/User"),
  create: jest.fn(),
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

  describe("When it receives a request with an existing user with correct password and a response", () => {
    test("Then it should call res' status and json with 200 and a token", async () => {
      findOne.mockImplementation(() => mockUser);
      compare.mockImplementation(() => true);

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
      const expectedError = new Error("Incorrect username or password");
      expectedError.statusCode = 403;

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with anexisting user with an incorrect password and a response", () => {
    test("Then it should call next function with a custom error 403 'Incorrect username or password'", async () => {
      findOne.mockImplementation(() => mockUser);
      compare.mockImplementation(() => false);
      const expectedError = new Error("Incorrect username or password");
      expectedError.statusCode = 403;

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given the registerUser controller", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const req = {
    body: {
      user: {
        name: "Kawaii Neko",
        username: "kawaiiNeko",
        password: "kawaiiNeko",
        image: "",
      },
    },
  };
  const next = jest.fn();

  describe("When it receives a request with an unexisting user and a response", () => {
    test("Then it should call res' status and json methods with 201 and the created user", async () => {
      findOne.mockImplementation(() => undefined);
      create.mockImplementation(() => mockUser);
      const expectedStatus = 201;
      const expectedBody = { newUser: mockUser };

      await registerUser(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedBody);
    });
  });

  describe("When it receives a request with an existing user and a response", () => {
    test("Then it should call next function with an error 409 and 'User already exists'", async () => {
      findOne.mockImplementation(() => mockUser);
      const expectedError = new Error("User already exists");
      expectedError.statusCode = 409;

      await registerUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with an unexisting user and a response but can't be created", () => {
    test("Then it should call next function with an error 409 and 'Couldn't create user'", async () => {
      findOne.mockImplementation(() => undefined);
      create.mockImplementation(() => {
        throw new Error();
      });
      const expectedError = new Error();
      expectedError.customMessage = "Couldn't create user";
      expectedError.statusCode = 409;

      await registerUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
