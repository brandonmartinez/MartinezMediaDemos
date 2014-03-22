function DemoViewModel() {
	'use strict';

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

		$.get(commandsUri, function (data) {
			var d, cs, commandSets = [], rawCommandSet, commands, rawCommand, newCommand;

			for (d = 0; d < data.length; d++) {
				rawCommandSet = data[d];

				commands = [];

				for (cs = 0; cs < rawCommandSet.Commands.length; cs++) {
					rawCommand = rawCommandSet.Commands[cs];
					newCommand = new CommandModel();

					newCommand.Id = rawCommand.Id;
					newCommand.Command = rawCommand.Command;
					newCommand.Data = rawCommand.Data;
					newCommand.GeneratedAt = rawCommand.GeneratedAt;

					commands.push(ko.observable(newCommand));
				}

				commandSets.push({
					Name: rawCommandSet.Name,
					Commands: commands
				});
			}

			vm.CommandSets(commandSets);

			vm.RetrievingData(false);
		});
	};

	vm.clearData = function() {
		vm.CommandSets([]);
	};

	vm.processData = function() {
		var i, cs, c, c1, com,
			commandSets,
			commandSet,
			command;

		commandSets = vm.CommandSets();


		for (cs = 0; cs < commandSets.length; cs++) {
			commandSet = commandSets[cs];
			for (c = 0; c < commandSet.Commands.length; c++) {
				command = commandSet.Commands[c]();
				command.resetObservables();
			}
		}

		for(i = 0; i < commandSets.length; i++) {
			commandSet = commandSets[i];

			for (c1 = 0; c1 < commandSet.Commands.length; c1++) {
				com = commandSet.Commands[c1]();

				com.Processing(true);
				com.SentAt(new Date());

				(function(cmd) {
					$.ajax({
						url: commandsUri,
						type: "POST",
						dataType: "json", // expected format for response
						contentType: "application/json",
						data: cmd.toDomainTransferModel(),
						success: function(result) {
							cmd.ProcessedAt(result.ProcessedAt);
							cmd.Failed(!result.Success);
							cmd.Success(result.Success);
							cmd.AdditionalInformation(result.AdditionalInformation);
							cmd.Processing(false);
						},
						error: function(error) {
							cmd.Failed(true);
							cmd.Success(false);
							cmd.AdditionalInformation('Server Error');
							cmd.Processing(false);
						}
					});
				} (com));
			}
		}
	};
}

var viewModel = new DemoViewModel();
viewModel.init({
	commandsUri: 'http://martinezmediademos.azurewebsites.net/samplecommands/'
});