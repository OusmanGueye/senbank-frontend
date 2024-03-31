import {Directive, Input, TemplateRef, ViewContainerRef} from "@angular/core";
import {AuthService} from "../../config/auth.service";

@Directive({
  standalone: true,
  selector: '[appHasRole]'
})
export class HasRoleDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  @Input() set appHasRole(roles: string[]) {
    const token = localStorage.getItem('token')!;
    const decodedToken = this.authService.getDecodedAccessToken(token);
    const userRole = decodedToken.roles;

    if (roles.includes(userRole)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
