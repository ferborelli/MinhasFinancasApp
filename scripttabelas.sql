create table financas.usuario (
	id bigserial not null primary key,
	nome character varying(150),
    email character varying(100),
	senha character varying(50),
	data_cadastro date DEFAULT now()	
);

create table financas.lancamento (

id bigserial not null primary key,
descricao character varying(100) not null,
mes integer not null,
ano integer not null,
valor numeric(16,2) not null,
tipo character varying(20) check ( tipo in ('RECEITA','DESPESA') ) not null,
status character varying(20) check ( status in('PENDENTE','CANCELADO','EFETIVADO' ) )  not null,
id_usuario bigint REFERENCES financas.usuario (id) not null,
data_cadastro date DEFAULT NOW()
);