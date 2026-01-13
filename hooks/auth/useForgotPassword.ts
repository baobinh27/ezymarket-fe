import { forgotPasswordRequest, forgotPasswordVerify, registerVerify } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

type ForgotPasswordVerifyParams = {
  email: string;
  otp: string;
  newPassword: string;
};

type RegisterVerifyParams = {
  email: string;
  otp: string;
};

export const useForgotPasswordRequest = () => {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => forgotPasswordRequest(email),
  });
};

export const useForgotPasswordVerify = () => {
  return useMutation({
    mutationFn: ({ email, otp, newPassword }: ForgotPasswordVerifyParams) =>
      forgotPasswordVerify(email, otp, newPassword),
  });
};

export const useRegisterVerify = () => {
  return useMutation({
    mutationFn: ({ email, otp }: RegisterVerifyParams) =>
      registerVerify(email, otp),
  });
};
