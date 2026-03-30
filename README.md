# 🚀 Home Study

Sistema base para uma escola EAD registrar professores, alunos, turmas, atividades, respostas e notas de forma centralizada.

---

## 🛠 Tecnologias e Ferramentas

Uma visão geral do ecossistema técnico utilizado:

- **Backend:** [Django 5.0](https://www.djangoproject.com/) + [Django Rest Framework (DRF)](https://www.django-rest-framework.org/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **Containerização:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- **Autenticação:** [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- **Frontend:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)

---

## 📌 Funcionalidades Principais

- ✅ **Gestão de Usuários:** Diferenciação entre perfis de Alunos e Professores.
- ✅ **Fluxo de Atividades:** Criação de atividades, submissão de respostas e prazos de entrega.
- ✅ **Sistema de Correção:** Módulo exclusivo para professores atribuírem notas (0-10) e feedbacks.
- ✅ **Área do Aluno:** Visualização de notas e histórico de submissões.
- ✅ **Seed Automatizado:** Comando customizado para criação de administrador via variáveis de ambiente.

---

## ⚙️ Como Rodar o Projeto

### Pré-requisitos

- Docker e Docker Compose instalados.
- Arquivo `.env` do backend configurado na raiz (veja `.env.example`).
- Arquivo `.env` do frontend configurado na pasta /frontend (veja `.env.example`).
  Obs: no arquivo `docker-compose.yml` o postgres está configurado na porta interna 5433

### Passo a Passo

1.  Clone o repositório: `git clone https://github.com/pedrohspires/teste.vaga-programador-pleno-prof-ce.git`
2.  Remove o sufixo `.example` dos `.env` mencionados anteriormente
3.  Configure os campos necessários do `.env`
4.  Execute o comando `docker-compose up --build` (executará seed do usuário admin, instala os pacotes do frontend e as migrations automaticamente)

---

## 🧠 Decisões Técnicas

Nesta seção, explico o porquê das escolhas feitas durante o desenvolvimento:

### Divisão de arquivos no back

Os arquivos foram dividindo seguindo boas praticas do Clean Architecture, dividindo o frontend e o backend em pastas separadas,
além dos requirements e settings separados em arquivos para dev e prod,

- **Motivo:** Melhora a escalabilidade e evita erros de ambiente.

### Base do front

Foi usado uma base particular para iniciar o frontend. Alguns componentes já estavam prontos.

- **Motivo:** Velocidade no desenvolvimento devido aos anos de experiência com o estilo de aplicação.

### Segurança via cookies

Todo o sistema é protegido via cookies com HttpOnly, com login e logout no backend.

- **Motivo:** Previne ataques conhecidos caso tokens sejam guardados no localstorage.

### Segurança das rotas

Rotas são protegidas por IsProfessor e IsAluno, além do padrão IsAuthenticated quando a rota não tem restrição de tipo de usuário

- **Motivo:** Algumas rotas só podem ser acessadas pelo PROFESSOR e outras pelo ALUNO.

### Organização de ViewSets e Actions

Utilizei `GenericViewSets` com `Mixins` específicos (como `CreateModelMixin`) em vez de `ModelViewSet` completo em certas rotas.

- **Motivo:** Maior controle de segurança. Por exemplo, impedi o método `PUT` na edição de respostas, permitindo apenas `PATCH` para garantir que o aluno não altere campos indevidos (como o ID do autor).

### Uso de branches

Foi utilizado branches para desenvolver algumas funcionalidades do sistema.

- **Motivo:** Ajuda no controle do versionamento, bem como merges em trabalho em equipes distintas.

---

## 🚧 Desafios e Observações

- **Backend Django:** Como citado no email de aplicação, sou dev .Net + React. Utilizar Django foi um desafio interessante para passar o feriado, noite de aniverário e fim de semana codando rsrs. Como costumo dizer, linguagens e frameworks são apenas ferramentas, gosto de utilizar o máximo possível e dos desafios que trazem.

---

## 🏛️ Cumprimento das Regras de Negócio

Para garantir a integridade do sistema pedagógico, todos os requisitos solicitados foram implementados e validados:

### 🎓 Regras do Aluno

- **[v] Vínculo com Turma:** Implementada validação que impede o acesso ou submissão de atividades de turmas às quais o aluno não pertence.
- **[v] Unicidade de Resposta:** O sistema bloqueia tentativas de envio de mais de uma resposta para a mesma atividade pelo mesmo aluno.
- **[v] Edição Temporal:** O aluno possui permissão para alterar sua resposta via `PATCH`, desde que a data de entrega da atividade não tenha expirado.

### 👨‍🏫 Regras do Professor e Correção

- **[v] Propriedade da Atividade:** Validação de segurança que garante que um professor só possa corrigir atividades que ele mesmo criou.
- **[v] Gestão de Notas:** CRUD completo de correções permitindo ao professor atribuir e editar notas e feedbacks.
- **[v] Validação de Nota:** Implementado `MinValueValidator(0)` e `MaxValueValidator(10)` no banco de dados e no Serializer, tornando a nota **obrigatória**.
- **[v] Feedback Opcional:** O campo de feedback foi configurado como `blank=True, null=True`, respeitando a opcionalidade pedida.

### 🛡️ Segurança e Acessos

- **[v] Isolamento de Perfil:** Professores possuem acesso exclusivo à listagem de respostas de atividades e criação de correções.
- **[v] Autorização de Correção:** Alunos não podem, sob hipótese alguma, visualizar as notas de outros colegas.

### 🎓 Regras do Aluno

- **[v] Vínculo com Turma:** Implementada validação que impede o acesso ou submissão de atividades de turmas às quais o aluno não pertence.
- **[v] Unicidade de Resposta:** O sistema bloqueia tentativas de envio de mais de uma resposta para a mesma atividade pelo mesmo aluno.
- **[v] Edição Temporal:** O aluno possui permissão para alterar sua resposta via `PATCH`, desde que a data de entrega da atividade não tenha expirado.

Obs: validações foram feitas no backend

## 💡 O que poderia melhorar

Alguns itens foram deixados de lado para atender as funcionalidades principais

- **[v] Dashboard:** Gráficos e tabelas para visualizar notas, médias de notas (por turma ou geral), quantidade de atividades, respostas por dia, etc.
- **[v] Mensagens de erro:** Alguns toasts apresentam mensagens padrão do Django.
- **[v] Horário para expiração da atividade**
- **[v] Travas visuais para cadastro de respostas** (além das travas na api)
- **[v] Filtros nas listagens, pesquisas em selects, etc**

## 📫 Contato

- **Pedro Henrique** - [LinkedIn](https://www.linkedin.com/in/pedrohspires/) - [Email](mailto:pedropires2603@gmail.com)
