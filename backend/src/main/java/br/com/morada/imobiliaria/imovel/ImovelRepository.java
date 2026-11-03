package br.com.morada.imobiliaria.imovel;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.morada.imobiliaria.imovel.ImovelModel;

public interface ImovelRepository extends JpaRepository<ImovelModel, Integer> {
}
