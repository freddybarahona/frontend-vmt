import { Routes } from "@angular/router";
import { AdministratorDashboard } from "./pages/administrator-dashboard/administrator-dashboard";
import { VerifyCodeComponent } from "./pages/verify-code-component/verify-code-component";
import { CreateUserComponent } from "./pages/create-user-component/create-user-component";
import { verifyCodeGuard } from "../../core/guards/verify-code-guard";
import { DashboardBi } from "./pages/dashboard-bi/dashboard-bi";

export default [
  {
    path: '',
    component: AdministratorDashboard
  },
  {
    path: 'createUser',
    component: CreateUserComponent,
  },
  {
    path: 'verifyCode',
    component: VerifyCodeComponent,
    canActivate: [verifyCodeGuard]
  },
  {
    path: 'dashboard-bi',
    component: DashboardBi
  }
] as Routes