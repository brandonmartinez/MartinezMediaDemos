function DemoViewModel() {
	// Private Fields
	var vm = this,
		commandsUri,
		numberOfCommandSets = 0,
		numberOfCommandSetsFinished = 0;

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
	function resetCommandStatuses() {
		vm.CommandSets().forEach(function(commandSet) {
			commandSet.Commands.forEach(function(command) {
				var cmd = command();
				cmd.resetObservables();
			});
		});
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

		vm.CommandSets(commandSets);

		vm.RetrievingData(false);
	}

	function checkIfCommandSetsFinishedProcessing() {
		if(numberOfCommandSets === numberOfCommandSetsFinished) {
			vm.ProcessingData(false);
		}
	}

	function processCommand(commands, length, i) {
		if(!vm.ProcessingData()) {
			return;
		}

		var command = commands[i]();
		command.Processing(true);
		command.SentAt(new Date());

		$.ajax({
			url: commandsUri,
			type: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			data: command.toDomainTransferModel(),
			success: function(result) {
				command.ProcessedAt(result.ProcessedAt);
				command.Failed(!result.Success);
				command.Success(result.Success);
				command.AdditionalInformation(result.AdditionalInformation);
				command.Processing(false);

				i++;
				if(i !== length && result.Success) {
					processCommand(commands, length, i);
				} else {
					console.log('Finished a command set');
					numberOfCommandSetsFinished++;
					checkIfCommandSetsFinishedProcessing();
				}
			},
			error: function(error) {
				command.Failed(true);
				command.Success(false);
				command.AdditionalInformation('Server Error');
				command.Processing(false);

				numberOfCommandSetsFinished++;
				checkIfCommandSetsFinishedProcessing();
			}
		});
	}

	function processCommandSets(commandSets) {
		var commandSet;
		numberOfCommandSets = commandSets.length - 1;
		numberOfCommandSetsFinished = 0;

		for(i = 0; i < commandSets.length; i++) {
			commandSet = commandSets[i];
			processCommand(commandSet.Commands, commandSet.Commands.length, 0);
		}
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
		$.get(commandsUri, processRetrievedCommandSets);
	};

	vm.clearData = function() {
		vm.CommandSets([]);
	};

	vm.processData = function() {
		resetCommandStatuses();
		
		vm.ProcessingData(true);

		processCommandSets(vm.CommandSets());
	};

	vm.cancelAction = function() {
		vm.ProcessingData(false);
	};
}

var viewModel = new DemoViewModel();
viewModel.init({
	commandsUri: 'http://martinezmediademos.azurewebsites.net/samplecommands/'
});