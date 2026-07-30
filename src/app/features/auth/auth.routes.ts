import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { CreateUserComponent } from "./pages/create-user-component/create-user-component";
import { VerifyCodeComponent } from "./pages/verify-code-component/verify-code-component";

export default [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'createUser',
    component: CreateUserComponent
  },
  {
    path: 'verifyCode',
    component: VerifyCodeComponent
  }
] as Routes