// TODO: we should do this efficiently on the CAP backend
$.context.riskOwners = $.context.risks.value.map(function(risk) {
		return risk.owner;
	}).filter(function(riskOwner, index, riskOwners) { 
		return riskOwners.indexOf(riskOwner) === index;
    });