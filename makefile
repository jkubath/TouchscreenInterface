run:
	(cd "build"; make run;)

stop:
	(cd "build"; make stop;)

deploy1:
	(cd "spikes"; make build;)
	(cd "build"; make deploy;)
