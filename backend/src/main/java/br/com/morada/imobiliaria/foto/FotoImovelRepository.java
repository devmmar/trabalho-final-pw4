package br.com.morada.imobiliaria.foto;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.morada.imobiliaria.foto.FotoImovelModel;

public interface FotoImovelRepository extends JpaRepository<FotoImovelModel, Integer> {
    List<FotoImovelModel> findByImovelId(Integer imovelId);
}
