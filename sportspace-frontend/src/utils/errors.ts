import { t } from "i18next";

export const handleError = (
  error: unknown,
  setError: (message: string) => void,
) => {
  setError(getErrorMessage(error));
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    if (error.message.startsWith("Failed ")) return t("error.tryagainlater");
    return t(`error.fetch.${error.message.replaceAll(" ", "").toLowerCase()}`);
  }
  return t("error.somethingwentwrong");
};
