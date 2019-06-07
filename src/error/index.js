import CustomError from "custom-error-instance" ;
export const CaughtException = CustomError( "CaughtException", {
  message: "An exception we can safelly show to the user" });
export const IoError = CustomError( "IoError", CaughtException, { message: "IO error" });
export const RuntimeError = CustomError( "RuntimeError", CaughtException, { message: "Runtime error" });
export const InvalidArgumentError = CustomError( "InvalidArgumentError", CaughtException, {
  message: "Invalid argument error" });
export const TestGeneratorError = CustomError( "TestGeneratorError",
  CaughtException, { message: "Test generatorerror" });
export const ExpressionParserException = CustomError( "ExpressionParserException", {
  message: "Cannot parse this expresion" });