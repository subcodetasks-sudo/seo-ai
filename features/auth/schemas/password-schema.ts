import { z } from "zod";

const LETTER_REGEX = /[a-zA-Z]/;
const DIGIT_REGEX = /\d/;
const SYMBOL_REGEX = /[^A-Za-z0-9]/;

export type PasswordSchemaMessages = {
  passwordMin: string;
  passwordLetterRequired: string;
  passwordDigitRequired: string;
  passwordSymbolRequired: string;
};

export function createPasswordSchema(messages: PasswordSchemaMessages) {
  return z
    .string()
    .min(8, messages.passwordMin)
    .regex(LETTER_REGEX, messages.passwordLetterRequired)
    .regex(DIGIT_REGEX, messages.passwordDigitRequired)
    .regex(SYMBOL_REGEX, messages.passwordSymbolRequired);
}
