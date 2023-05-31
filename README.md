# bexup
Bexup evaluation source
Teste BEXUP:


1. Backend
2. FrontEnd

Subir no github e enviar link para o email: rsimonassi@bexup.com



1 .BackEnd:

1.1. Criar um serviço REST na API-1 para acionar a ”carga inicial” dos dados de veículos.

1.2. Implementar a lógica na API-1 para buscar as "marcas" no serviço da  FIPE (https://deividfortuna.github.io/fipe/).

1.3. Configurar uma “Fila” para receber as "marcas" da API-1 e enviar uma por vez para a API-2 para processamento assíncrono.

1.4. Implementar a lógica na API-2 para buscar os "códigos" e "modelos" dos veículos no serviço da FIPE com base nas "marcas" recebidas da fila.

1.5. Implementar a lógica na API-2 para salvar no banco de dados relacional as informações de "código", "marca" e "modelo" dos veículos encontrados no serviço da FIPE.

1.6. Criar um serviço REST na API-1 para buscar as "marcas" armazenadas no banco de dados.

1.7. Criar um serviço REST na API-1 para buscar os "códigos", "modelos" e “observações” dos veículos por "marca" no banco de dados.

1.8. Criar um serviço REST na API-2 para salvar os dados alterados do veículo, como: "modelo" e “observações”  no banco de dados.


Utilizar o Cloud Build, Cloud Run, Cloud Task e Postgres será considerado um diferencial.

Obs: Todo o cuidado com o desenvolvimento será considerado, como: uso das boas práticas, testes, modelagem, arquitetura, contrato de api, etc…






2 . FrontEnd:

2.1. Criar um componente "ComboBox" que exiba todas as "marcas" de veículos consultadas em uma API (API-1) e permita selecionar uma marca.

2.2. Implementar um evento de seleção na "ComboBox" que carregue uma “tabela” com as colunas "código" e "modelo" dos veículos associados à marca selecionada e consultada em uma API (API-1)

2.3. Na “tabela” criar o botão de “editar”, para alterar os dados do veículo. 

2.4. Implementar a lógica de filtragem para exibir as informações dos veículos na “tabela” com base nos critérios de filtragem digitados pelo usuário, considerando tanto o código quanto o modelo.

2.5. Criar uma nova tela para editar as informações do veículo, como: “modelo” e “observações” e salvar utilizando o serviço da API (API-2). 

2.6. Após salvar, voltar na tela de visualização dos veículos filtrados e com as informações atualizadas e com as informações do último filtro. 





![Screen Shot 2023-05-30 at 10 12 37 PM](https://github.com/iuri/bexup/assets/630005/0e6fe1ee-0e46-4d2d-b5e0-ab870942e4d1)


