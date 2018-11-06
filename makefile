run:
	(cd "deploy"; make run;)

stop:
	(cd "deploy"; make stop;)

deploy1:
	(cd "spikes"; make build;)
	(cd "build"; make deploy;)
	cp spikes/Compiled\ App/makefile ./deploy
