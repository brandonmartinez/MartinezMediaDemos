function DemoViewModel() {
	// Private Fields
	var vm = this,
		commandsUri;

	// Public Properties
	vm.CommandSets = ko.observableArray([]);
	vm.RetrievingData = ko.observable(false);
	vm.ProcessingData = ko.observable(false);

	vm.CanModifyData = ko.computed(function() {
		return !vm.RetrievingData() && !vm.ProcessingData();
	});

	vm.CanCancel = ko.computed(function() {
		return vm.ProcessingData();
	});

	// Private Functions
	function resetCommandStatuses(commandSets) {
		commandSets.forEach(function(commandSet) {
			commandSet.Commands.forEach(function(command) {
				var cmd = command();
				cmd.resetObservables();
			});
		});

		return commandSets;
	}

	function processRetrievedCommand(rawCommand) {
		var newCommand = new CommandModel();

		newCommand.Id = rawCommand.Id;
		newCommand.Command = rawCommand.Command;
		newCommand.Data = rawCommand.Data;
		newCommand.GeneratedAt = rawCommand.GeneratedAt;

		return ko.observable(newCommand);
	}

	function processRetrievedCommands(rawCommands) {
		var i, commands = [], command;

		for (i = 0; i < rawCommands.length; i++) {
			commands.push(processRetrievedCommand(rawCommands[i]));
		};

		return commands;
	}

	function processRetrievedCommandSets(rawCommandSets) {
		var commandSets = [], i, commandSet;

		for(i = 0; i < rawCommandSets.length; i++) {
			commandSet = rawCommandSets[i];
			commandSets.push({
				Name: commandSet.Name,
				Commands: processRetrievedCommands(commandSet.Commands)
			})
		}
		return commandSets;
	}

	function postAndValidateCommandResponse(command) {
		command.Processing(true);
		command.SentAt(new Date());

		return Promise.resolve($.ajax({
					url: commandsUri,
					type: 'POST',
					dataType: 'json',
					contentType: 'application/json',
					data: command.toDomainTransferModel(),
				})).then(function (result) {
					command.ProcessedAt(result.ProcessedAt);
					command.Failed(!result.Success);
					command.Success(result.Success);
					command.AdditionalInformation(result.AdditionalInformation);
					command.Processing(false);

					if(!result.Success) {
						throw 'Command Set failed processing at server';
					}

					return true;
				}, function (err) {
					command.Failed(true);
					command.Success(false);
					command.AdditionalInformation(err.statusText || 'An unhandled exception occurred.');
					command.Processing(false);

					throw 'Command Set failed sending to the server';
				});
	}

	function processCommandSets(commandSets) {
		var promises = [];

		// Pushing another dynamic promise into the queue
		commandSets.forEach(function(commandSet) {
			// Create the promise chain for the set
			var commands = commandSet.Commands, promise;

			promise = commands.reduce(function(sequence, command) {
					return sequence
						.then(function() {
							if(!vm.ProcessingData()) {
								throw 'Processing of data has been stopped';
							}

							return command();
						})
						.then(postAndValidateCommandResponse);
					}, Promise.resolve())
				.catch(function(err) {
					console.log(err);
				});

			promises.push(promise);
		});

		// Run promise chains at the same time
		return Promise.all(promises);
	}

	// Public Functions
	vm.init = function (options) {
		// Assign Options
		commandsUri = options.commandsUri;

		// Initial Data Grab
		vm.refreshData();

		// Bind KO
		ko.applyBindings(vm);
	};

	vm.refreshData = function() {
		vm.RetrievingData(true);
		return Promise.resolve($.get(commandsUri))
			.then(processRetrievedCommandSets)
			.then(function(commandSets) {
				return vm.CommandSets(commandSets);
			})
			.then(function() {
				vm.RetrievingData(false);
			}, function(err) {
				console.log(err);
				vm.RetrievingData(false);
			});
	};

	vm.processData = function() {
		return Promise.resolve()
			.then(function() {
				vm.ProcessingData(true);

				return vm.CommandSets();
			})
			.then(resetCommandStatuses)
			.then(processCommandSets)
			.then(function(test) {
				vm.ProcessingData(false);
			}, function(err) {
				console.log(err);
				vm.ProcessingData(false);
			});
	};

	vm.clearData = function() {
		vm.CommandSets([]);
	};

	vm.cancelAction = function() {
		vm.ProcessingData(false);
	};
}

var viewModel = new DemoViewModel();
viewModel.init({
	commandsUri: 'http://martinezmediademos.azurewebsites.net/samplecommands/'
});