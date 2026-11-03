package br.com.morada.imobiliaria.bairro;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.morada.imobiliaria.bairro.BairroModel;

@Repository
public interface BairroRepository extends JpaRepository<BairroModel, Integer> {
}
