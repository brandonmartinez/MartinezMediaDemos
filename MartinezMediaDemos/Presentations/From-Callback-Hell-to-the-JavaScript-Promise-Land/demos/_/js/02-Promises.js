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
		return Q(vm.RetrievingData(true))
			.then(function() {
				return Q($.get(commandsUri));
			})
			.then(function (rawCommandSets) {
				var commandSets = [];

				rawCommandSets.forEach(function(rawCommandSet) {
					var commands = [];

					rawCommandSet.Commands.forEach(function(rawCommand) {
						var newCommand = new CommandModel();

						newCommand.Id = rawCommand.Id;
						newCommand.Command = rawCommand.Command;
						newCommand.Data = rawCommand.Data;
						newCommand.GeneratedAt = rawCommand.GeneratedAt;

						commands.push(ko.observable(newCommand));
					});

					commandSets.push({
						Name: rawCommandSet.Name,
						Commands: commands
					});
				});

				return commandSets;
			})
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

	vm.clearData = function() {
		vm.CommandSets([]);
	};

	vm.processData = function() {
		Q(vm.CommandSets())
			.then(function(commandSets){
				var cs, c,
					commandSets,
					commandSet,
					command;

				for (cs = 0; cs < commandSets.length; cs++) {
					commandSet = commandSets[cs];
					for (c = 0; c < commandSet.Commands.length; c++) {
						command = commandSet.Commands[c]();
						command.resetObservables();
					}
				}

				return commandSets;
			})
			.then(function(commandSets) {
				vm.ProcessingData(true);

				var promises = [];

				commandSets.forEach(function(commandSet) {
					commandSet.Commands.forEach(function(command) {
						var promise = Q(command())
							.then(function(cmd) {
								cmd.Processing(true);
								cmd.SentAt(new Date());
								return cmd;
							})
							.then(function(cmd) {
								return Q($.ajax({
									url: commandsUri,
									type: "POST",
									dataType: "json", // expected format for response
									contentType: "application/json",
									data: cmd.toDomainTransferModel()
								}))
								.then(function(result) {
									cmd.ProcessedAt(result.ProcessedAt);
									cmd.Failed(!result.Success);
									cmd.Success(result.Success);
									cmd.AdditionalInformation(result.AdditionalInformation);
									cmd.Processing(false);
								}, function(error) {
									cmd.Failed(true);
									cmd.Success(false);
									cmd.AdditionalInformation('Server Error');
									cmd.Processing(false);
								});
							});
						promises.push(promise);
					});
				});

				return Q.all(promises).then(function() {
					vm.ProcessingData(false);
				});
			});
	};
}

var viewModel = new DemoViewModel();
viewModel.init({
	commandsUri: 'http://martinezmediademos.azurewebsites.net/samplecommands/'
});