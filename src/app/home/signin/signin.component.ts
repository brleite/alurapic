import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { PlatformDetectorService } from 'src/app/core/platform-detector/platform-detector.service';

@Component({
  templateUrl: './signin.component.html'
})
export class SignInComponent implements OnInit, AfterViewInit {

  fromUrl: string;

  loginForm: FormGroup;
  @ViewChild('userNameInput') userNameInput: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private platformDetectorService: PlatformDetectorService,
    private activatedRoute: ActivatedRoute/* ,
    private titleService: Title */) {

  }

  ngAfterViewInit(): void {
    this.platformDetectorService.isPlatformBrowser() && this.userNameInput.nativeElement.focus();
  }

  ngOnInit(): void {
    // Removido para utilizar os dados da própria rota
    /* this.titleService.setTitle('Login'); */

    this.activatedRoute.queryParams.subscribe(params => this.fromUrl = params['fromUrl']);

    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    const userName = this.loginForm.get('userName').value;
    const password = this.loginForm.get('password').value;

    this.authService
      .authenticate(userName, password)
      .subscribe(
        () => {
          // this.router.navigateByUrl('user/' + userName)
          // Mesma coisa que o de cima
          if (this.fromUrl) {
            this.router.navigateByUrl(this.fromUrl)
          } else {
            this.router.navigate(['user', userName]);
          }
        },
        err => {
          console.log(err);

          alert('Invalid username or password');
          this.loginForm.reset();
          this.platformDetectorService.isPlatformBrowser() && this.userNameInput.nativeElement.focus();
        });
  }
}
