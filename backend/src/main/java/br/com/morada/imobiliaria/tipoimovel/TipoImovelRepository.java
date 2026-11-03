package br.com.morada.imobiliaria.tipoimovel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.morada.imobiliaria.tipoimovel.TipoImovelModel;

@Repository
public interface TipoImovelRepository extends JpaRepository<TipoImovelModel, Integer> {
}
