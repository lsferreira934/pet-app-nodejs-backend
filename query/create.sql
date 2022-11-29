create schema pet

/* criar banco de dados */
create table pet.users (
	id uuid primary key,
	name text not null,
	last_name text not null,
	email text not null,
	phone text not null,
	password text not null,
	created_at timestamp default now() not null,
	updated_at timestamp default now() not null
)

/* criar enum para o campo role */
create type pet.enum_role as enum (
	'user','admin'
)

/* criar tabela roles */
create table pet.roles(
	id uuid primary key,
	name pet.enum_role not null,
	created_at timestamp default now() not null,
	updated_at timestamp default now() not null
)

/* criar tabela de ligação users -> roles */
create table pet.user_roles(
	id uuid primary key,
	role_id uuid not null,
	user_id uuid not null,
	created_at timestamp default now() not null,
	updated_at timestamp default now() not null
)

/* Constraint - tabela users / tabela user_roles */
alter table pet.user_roles add constraint roles_user_id_fk foreign key (user_id) references pet.users(id) 

/* Constraint - tabela roles / tabela user_roles */
alter table pet.user_roles add constraint roles_role_id_fk foreign key (role_id) references pet.roles(id) 


/* Criação da nova tabela || Constraint - tabela blacklist_token / tabela users */
create table pet.blacklist_token(
	id uuid primary key,
	user_id uuid not null,
	token text not null,
	created_at timestamp default now() not null,
	updated_at timestamp default now() not null,
	constraint toke_user_id_fk foreign key (user_id) references pet.users(id)
)