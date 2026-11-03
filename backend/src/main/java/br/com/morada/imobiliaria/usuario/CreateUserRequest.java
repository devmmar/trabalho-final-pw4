package br.com.morada.imobiliaria.usuario;

import br.com.morada.imobiliaria.usuario.TipoUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
        @NotBlank String nome,
        @Email @NotBlank String email,
        @NotBlank @Size(min = 8) String password,
        @NotNull TipoUsuario tipo) {
}
