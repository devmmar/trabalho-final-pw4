package br.com.morada.imobiliaria.imovel;

import jakarta.validation.constraints.NotBlank;

public record StatusRequest(@NotBlank String status) {
}
