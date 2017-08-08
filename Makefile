DC = docker-compose
TOOLS = $(DC) run --rm app

start:
	@$(DC) run --rm --name takeapic app yarn start

install:
	@$(TOOLS) yarn install

test:
	@$(TOOLS) yarn test

rm:
	@$(DC) kill
	@$(DC) rm -fv
