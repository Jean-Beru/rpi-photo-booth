DC = docker-compose
TOOLS = $(DC) run --rm app

start:
	@$(DC) run --rm --name takeapic app npm start

install:
	@$(TOOLS) npm install

test:
	@$(TOOLS) npm test

rm:
	@$(DC) kill
	@$(DC) rm -fv
