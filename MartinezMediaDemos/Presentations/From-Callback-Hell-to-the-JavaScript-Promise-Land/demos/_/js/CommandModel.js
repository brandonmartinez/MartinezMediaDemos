function CommandModel() {
	// Private Fields
	var self = this;

	// Public Fields/Observables
	self.Id;
	self.Command;
	self.Data;
	self.GeneratedAt;

	self.SentAt = ko.observable();
	self.ProcessedAt = ko.observable();
	self.AdditionalInformation = ko.observable();

	self.Processing = ko.observable(false);
	self.Failed = ko.observable(false);
	self.Success = ko.observable(false);

	// Public Functions
	self.resetObservables = function() {
		self.SentAt(null);
		self.ProcessedAt(null);
		self.AdditionalInformation(null);
		self.Processing(false);
		self.Failed(false);
		self.Success(false);
	};

	self.toDomainTransferModel = function() {
		return {
			Id: self.Id,
			Command: self.Command,
			Data: self.Data,
			GeneratedAt: self.GeneratedAt,
		}
	};
}