$.context.riskMitigationPayload = {
    "definitionId": "riskmitigation",
	"context": {
        "risk": $.context.pendingRiskMitigations.shift()
    }
}