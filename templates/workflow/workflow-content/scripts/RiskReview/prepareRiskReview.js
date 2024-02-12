$.context.risks = $.context.risks.value.map(function(risk) {
        var newRisk = {};
        newRisk.ID = risk.ID;
        newRisk.IsActiveEntity = risk.IsActiveEntity; //TODO: PATCHing an active entity is only possible via a patch choreography. https://sapjira.wdf.sap.corp/browse/CDSNODE-2180
        newRisk.title = risk.title || "";
        newRisk.descr = risk.descr || "";
        newRisk.prio = risk.prio || "MEDIUM";
        newRisk.impact = risk.impact || 0;
        newRisk.owner = risk.owner;
		return newRisk;
    });

var risksOrig = JSON.parse(JSON.stringify($.context.risks));
$.context.riskMap = risksOrig.reduce(function(map, risk) {
    map[risk.ID] = risk;
    return map;
}, {});