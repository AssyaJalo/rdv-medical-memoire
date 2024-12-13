import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  veriform = false;
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      dateNaiss: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      role_id: [1]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  register() {
    this.veriform = true; // Activer les messages d'erreur lors de la soumission
    if (this.registerForm.valid) {
      const formData = { ...this.registerForm.value, role_id: 1 }; // Include role_id
      this.authService.register(formData).subscribe(
        response => {
          this.authService.saveToken(response.access_token);
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Erreur d\'inscription', error);
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement';
    }
    }

}
