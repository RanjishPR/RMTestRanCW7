$.context.pendingRiskUpdates = [];
$.context.riskUpdates = [];
$.context.pendingRiskMitigations = [];
$.context.riskMitigations = [];

$.context.risks.forEach(function(risk) {
    var riskOrig = $.context.riskMap[risk.ID];
    if (riskOrig.title !== risk.title || riskOrig.prio !== risk.prio || riskOrig.impact !== risk.impact || riskOrig.descr !== risk.descr) {
        $.context.pendingRiskUpdates.push(risk);
        $.context.riskUpdates.push(risk.ID);

        // TODO: this should be a rule instead
        if (risk.prio === "VERY_HIGH" || (risk.prio === "HIGH" && risk.impact >= 1000)) {
            $.context.pendingRiskMitigations.push(risk);
            $.context.riskMitigations.push(risk.ID);
        }
    }
});

$.context.cdsDraftEdit = { "PreserveChanges": true };
$.context.cdsDraftActivate = {};