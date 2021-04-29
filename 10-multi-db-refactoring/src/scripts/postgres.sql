DROP TABLE IF EXISTS TB_HEROIS;
CREATE TABLE TB_HEROIS (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
    nome TEXT NOT NULL,
    poder TEXT NOT NULL
);

--create
INSERT INTO TB_HEROIS(nome, poder)
VALUES
('Flash', 'Velocidade'),
('Batman', 'Dinheiro');

--read
SELECT nome FROM TB_HEROIS WHERE id = 2;

--update
UPDATE TB_HEROIS
SET nome = 'Goku', poder = 'Godmode'
WHERE id = 1;

--delete
DELETE FROM TB_HEROIS WHERE id = 3;