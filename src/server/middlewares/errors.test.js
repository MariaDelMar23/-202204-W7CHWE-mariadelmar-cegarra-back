const { notFoundError, generalError } = require("./errors");

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
describe("Given the notFoundError middleware", () => {
  describe("When it receives a response", () => {
    test("Then it should call its methods status and json with 404 and {msg:'Endpoint not found'} respectively", async () => {
      const expectedStatus = 404;
      const expectedBody = { message: "Endpoint not found" };

      await notFoundError(null, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedBody);
    });
  });
});

describe("Given the generalError middleware", () => {
  describe("When it receives a custom error and a response", () => {
    test("Then it should call res' status and json methods with 409 and { message: 'Incorrect username or password' } respectively", async () => {
      const error = {
        statusCode: 409,
        customMessage: "Incorrect username or password",
      };
      const expectedStatus = 409;
      const expectedBody = { message: "Incorrect username or password" };

      await generalError(error, null, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedBody);
    });
  });

  describe("When it receives an error and a response", () => {
    test("Then it should call res' status and json methods with 500 and { message: 'General pete' }", async () => {
      const error = {
        status: 0,
        message: "TypeError: Could not read properties of undefined",
      };
      const expectedStatus = 500;
      const expectedBody = { message: "General pete" };

      await generalError(error, null, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedBody);
    });
  });
});
