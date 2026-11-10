-- Dados ilustrativos para desenvolvimento local da aula05.
-- Pode ser executado novamente sem duplicar estes registros.
USE projetoimobiliaria;

INSERT INTO bairros (nome, cidade, estado, cep_inicial, cep_final, created_at, updated_at)
SELECT 'Centro', 'Santa Maria', 'RS', '97010000', '97019999', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM bairros WHERE nome = 'Centro' AND cidade = 'Santa Maria');

INSERT INTO bairros (nome, cidade, estado, cep_inicial, cep_final, created_at, updated_at)
SELECT 'Camobi', 'Santa Maria', 'RS', '97105000', '97119999', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM bairros WHERE nome = 'Camobi' AND cidade = 'Santa Maria');

INSERT INTO tipos_imoveis (nome, descricao, created_at, updated_at)
SELECT 'Casa', 'Imovel residencial do tipo casa', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tipos_imoveis WHERE nome = 'Casa');

INSERT INTO tipos_imoveis (nome, descricao, created_at, updated_at)
SELECT 'Apartamento', 'Unidade residencial em edificio', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tipos_imoveis WHERE nome = 'Apartamento');

INSERT INTO imoveis (titulo, descricao, preco_venda, finalidade, status, dormitorios, banheiros,
                     garagem, area_total, area_construida, endereco, numero, cep, destaque,
                     bairro_id, tipo_imovel_id)
SELECT 'Casa de exemplo no Centro', 'Registro demonstrativo para testar a API', 450000.00,
       'Residencial', 'Disponivel', 3, 2, 1, 180.00, 120.00, 'Rua Exemplo', '100', '97010000', 1,
       b.id, t.id
FROM bairros b CROSS JOIN tipos_imoveis t
WHERE b.nome = 'Centro' AND b.cidade = 'Santa Maria' AND t.nome = 'Casa'
  AND NOT EXISTS (SELECT 1 FROM imoveis WHERE titulo = 'Casa de exemplo no Centro');

INSERT INTO imoveis (titulo, descricao, preco_aluguel, finalidade, status, dormitorios, banheiros,
                     garagem, area_total, area_construida, endereco, numero, cep, destaque,
                     bairro_id, tipo_imovel_id)
SELECT 'Apartamento de exemplo em Camobi', 'Registro demonstrativo para testar a API', 2200.00,
       'Residencial', 'Disponivel', 2, 1, 1, 75.00, 68.00, 'Avenida Exemplo', '200', '97105000', 0,
       b.id, t.id
FROM bairros b CROSS JOIN tipos_imoveis t
WHERE b.nome = 'Camobi' AND b.cidade = 'Santa Maria' AND t.nome = 'Apartamento'
  AND NOT EXISTS (SELECT 1 FROM imoveis WHERE titulo = 'Apartamento de exemplo em Camobi');

-- Vitrine da Aula 2: imoveis extras para exercitar filtros, ordenacao e paginacao.
SET NAMES utf8mb4;

INSERT INTO bairros (nome, cidade, estado, created_at, updated_at)
SELECT d.nome, 'Santa Maria', 'RS', NOW(), NOW()
FROM (SELECT 'Nossa Senhora de Lourdes' AS nome UNION ALL SELECT 'Medianeira' UNION ALL SELECT 'Dores') d
WHERE NOT EXISTS (SELECT 1 FROM bairros b WHERE b.nome = d.nome AND b.cidade = 'Santa Maria');

INSERT INTO tipos_imoveis (nome, descricao, created_at, updated_at)
SELECT 'Sobrado', 'Casa de dois pavimentos', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tipos_imoveis WHERE nome = 'Sobrado');

INSERT INTO imoveis (titulo, descricao, preco_venda, preco_aluguel, finalidade, status, dormitorios,
                     banheiros, garagem, area_total, area_construida, endereco, numero, destaque,
                     bairro_id, tipo_imovel_id)
SELECT d.titulo, d.descricao, d.venda, d.aluguel, 'Residencial', 'Disponivel', d.dorm, d.banh, d.gar,
       d.area, d.construida, d.endereco, d.numero, 0, b.id, t.id
FROM (
  SELECT 'Sobrado com pátio em Lourdes' AS titulo, 'Dois pavimentos, suíte com sacada e pátio nos fundos.' AS descricao,
         690000.00 AS venda, NULL AS aluguel, 4 AS dorm, 3 AS banh, 2 AS gar, 220.00 AS area, 180.00 AS construida,
         'Rua Duque de Caxias' AS endereco, '1450' AS numero, 'Nossa Senhora de Lourdes' AS bairro, 'Sobrado' AS tipo
  UNION ALL SELECT 'Apartamento compacto no Centro', 'Um dormitório, perto do calçadão e do comércio.',
         NULL, 1450.00, 1, 1, 0, 42.00, 40.00, 'Rua do Acampamento', '320', 'Centro', 'Apartamento'
  UNION ALL SELECT 'Casa térrea na Medianeira', 'Casa térrea com jardim frontal e churrasqueira.',
         380000.00, NULL, 3, 1, 1, 150.00, 110.00, 'Rua Tuiuti', '2100', 'Medianeira', 'Casa'
  UNION ALL SELECT 'Apartamento com sacada em Camobi', 'Sacada com vista aberta, a cinco minutos da UFSM.',
         295000.00, 1800.00, 2, 1, 1, 68.00, 62.00, 'Avenida Roraima', '850', 'Camobi', 'Apartamento'
  UNION ALL SELECT 'Cobertura no Centro', 'Cobertura com terraço, três suítes e duas vagas.',
         980000.00, NULL, 3, 3, 2, 190.00, 170.00, 'Avenida Rio Branco', '400', 'Centro', 'Apartamento'
  UNION ALL SELECT 'Casa com jardim nas Dores', 'Terreno amplo, jardim e garagem para dois carros.',
         NULL, 3200.00, 3, 2, 2, 200.00, 140.00, 'Rua Coronel Niederauer', '1700', 'Dores', 'Casa'
  UNION ALL SELECT 'Sobrado geminado em Camobi', 'Sobrado novo com dois dormitórios e lavabo.',
         420000.00, NULL, 3, 2, 1, 130.00, 115.00, 'Rua Ernesto Pereira', '75', 'Camobi', 'Sobrado'
  UNION ALL SELECT 'Kitnet perto da UFSM', 'Mobiliada, ideal para estudantes.',
         NULL, 950.00, 1, 1, 0, 30.00, 28.00, 'Faixa de Camobi', '5200', 'Camobi', 'Apartamento'
) d
JOIN bairros b ON b.nome = d.bairro AND b.cidade = 'Santa Maria'
JOIN tipos_imoveis t ON t.nome = d.tipo
WHERE NOT EXISTS (SELECT 1 FROM imoveis i WHERE i.titulo = d.titulo);
