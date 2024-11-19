import { LoginForm } from "./LoginForm.tsx";

export const LoginPage = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gradient-to-r from-white via-slate-200 to-white">
      <div
        className="flex flex-col items-center justify-center gap-8 bg-white p-8 sm:rounded-lg shadow-0
                            xl:w-1/3 lg:w-2/5 md:w-1/2 sm:w-3/4 w-full sm:h-fit h-full"
      >
        <img src="/SIGL_Light.svg" alt="logo" className="h-40" />
        <LoginForm />
      </div>
    </div>
  );
};
